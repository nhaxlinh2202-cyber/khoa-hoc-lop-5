import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Progress from '@/models/Progress';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let progress = await Progress.findOne({ userId: user.userId });
  if (!progress) {
    progress = await Progress.create({ userId: user.userId, completedSteps: [], percentage: 0 });
  }

  return NextResponse.json({ success: true, progress });
}

export async function PUT(req: Request) {
  await connectDB();
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { stepKey } = await req.json();
  if (!stepKey) return NextResponse.json({ error: 'Thiếu stepKey' }, { status: 400 });

  let progress = await Progress.findOne({ userId: user.userId });
  if (!progress) {
    progress = await Progress.create({ userId: user.userId, completedSteps: [], percentage: 0 });
  }

  if (!progress.completedSteps.includes(stepKey)) {
    progress.completedSteps.push(stepKey);
    progress.percentage = Math.round((progress.completedSteps.length / 5) * 100);
    await progress.save();
  }

  return NextResponse.json({ success: true, progress });
}
