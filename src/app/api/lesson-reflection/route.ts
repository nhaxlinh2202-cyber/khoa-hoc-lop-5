import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reflection = await prisma.lessonReflection.findUnique({
    where: { userId: user.userId }
  });

  return NextResponse.json({ success: true, hasSubmitted: !!reflection, reflection });
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { emotion, content } = await req.json();

  const reflection = await prisma.lessonReflection.upsert({
    where: { userId: user.userId },
    update: { emotion, content },
    create: {
      userId: user.userId,
      studentName: user.name,
      emotion,
      content
    }
  });

  return NextResponse.json({ success: true, reflection });
}
