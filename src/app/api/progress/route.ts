import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let progress = await prisma.progress.findUnique({ where: { userId: user.userId } });
  if (!progress) {
    progress = await prisma.progress.create({ data: { userId: user.userId, completedSteps: '', percentage: 0 } });
  }

  const progressObj = { ...progress, completedSteps: progress.completedSteps ? progress.completedSteps.split(',') : [] };
  return NextResponse.json({ success: true, progress: progressObj });
}

export async function PUT(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { stepKey } = await req.json();
  if (!stepKey) return NextResponse.json({ error: 'Thiếu stepKey' }, { status: 400 });

  let progress = await prisma.progress.findUnique({ where: { userId: user.userId } });
  if (!progress) {
    progress = await prisma.progress.create({ data: { userId: user.userId, completedSteps: '', percentage: 0 } });
  }

  const steps = progress.completedSteps ? progress.completedSteps.split(',') : [];
  if (!steps.includes(stepKey)) {
    steps.push(stepKey);
    progress = await prisma.progress.update({
      where: { userId: user.userId },
      data: {
        completedSteps: steps.join(','),
        percentage: Math.round((steps.length / 5) * 100)
      }
    });
  }

  const progressObj = { ...progress, completedSteps: progress.completedSteps ? progress.completedSteps.split(',') : [] };
  return NextResponse.json({ success: true, progress: progressObj });
}
