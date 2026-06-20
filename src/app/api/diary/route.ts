import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diary from '@/models/Diary';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendDiaryNotification } from '@/lib/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET() {
  await connectDB();
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const diaries = await Diary.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, diaries });
}

export async function POST(req: Request) {
  await connectDB();
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  
  const newDiary = await Diary.create({
    userId: user.userId,
    studentName: user.name,
    ...body
  });

  // Gửi email thông báo cho GV (chạy ngầm không block request)
  sendDiaryNotification(user.name).catch(console.error);

  return NextResponse.json({ success: true, diary: newDiary });
}
