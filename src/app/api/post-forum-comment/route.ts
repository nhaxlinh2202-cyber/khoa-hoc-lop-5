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

  const { diaryId, content } = await req.json();
  if (!diaryId || !content) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

  const newComment = await prisma.postForumComment.create({
    data: {
      postClassDiaryId: diaryId,
      userId: user.userId,
      studentName: user.name,
      content
    }
  });

  return NextResponse.json({ success: true, comment: newComment });
}
