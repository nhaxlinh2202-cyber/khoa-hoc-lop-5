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

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { diaryId, content } = await req.json();
    const newComment = await prisma.forumComment.create({
      data: {
        preClassDiaryId: diaryId,
        userId: user.id || user.userId,
        studentName: user.name,
        content: content
      }
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: 'Phiên đăng nhập cũ bị lỗi kẹt dữ liệu. Vui lòng Đăng xuất và Đăng nhập lại từ Trang chủ!' }, { status: 500 });
  }
}
