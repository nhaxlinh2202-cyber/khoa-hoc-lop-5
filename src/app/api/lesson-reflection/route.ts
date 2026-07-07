import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('khoahoc5_auth_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const adapter = new PrismaLibSQL(libsql);
  const localPrisma = new PrismaClient({ adapter });

  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('all') === 'true' && user.role === 'teacher') {
      const reflections = await localPrisma.lessonReflection.findMany({
        orderBy: { createdAt: 'desc' }
      });
      await localPrisma.$disconnect();
      return NextResponse.json({ success: true, reflections });
    }

    const userId = user.userId || user.id;
    const reflection = await localPrisma.lessonReflection.findFirst({
      where: { userId: userId }
    });

    await localPrisma.$disconnect();
    return NextResponse.json({ success: true, hasSubmitted: !!reflection, reflection });
  } catch (e: any) {
    await localPrisma.$disconnect();
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { emotion, content } = await req.json();
    const userId = user.userId || user.id;

    if (!userId) {
      return NextResponse.json({ error: 'Token đăng nhập đã cũ hoặc lỗi. Mẹ/cô vui lòng F5 và ĐĂNG XUẤT rồi đăng nhập lại nhé!' }, { status: 400 });
    }

    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    const localPrisma = new PrismaClient({ adapter });

    try {
      const existing = await localPrisma.lessonReflection.findFirst({
        where: { userId: userId }
      });

      let reflection;
      if (existing) {
        reflection = await localPrisma.lessonReflection.update({
          where: { id: existing.id },
          data: { emotion, content }
        });
      } else {
        reflection = await localPrisma.lessonReflection.create({
          data: {
            userId: userId,
            studentName: user.name || 'Học sinh ẩn danh',
            emotion,
            content
          }
        });
      }

      await localPrisma.$disconnect();
      return NextResponse.json({ success: true, reflection });
    } catch (dbError: any) {
      await localPrisma.$disconnect();
      throw dbError;
    }
  } catch (error: any) {
    console.error('Lỗi khi lưu nhật ký:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
