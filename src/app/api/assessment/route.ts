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

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { situationalAnswers, emotion, emotionNote } = body;
    
    let submission = await prisma.assessmentSubmission.findUnique({ where: { userId: user.userId } });

    if (submission) {
      submission = await prisma.assessmentSubmission.update({
        where: { userId: user.userId },
        data: {
          studentName: user.name,
          ...(emotion !== undefined && { emotion }),
          ...(emotionNote !== undefined && { emotionNote }),
          situationalAnswers: situationalAnswers && situationalAnswers.length > 0 ? {
            create: situationalAnswers.map((ans: any) => ({
              questionId: ans.questionId,
              studentAnswer: ans.studentAnswer
            }))
          } : undefined
        },
        include: { situationalAnswers: true }
      });
    } else {
      submission = await prisma.assessmentSubmission.create({
        data: {
          userId: user.userId,
          studentName: user.name,
          emotion: emotion || null,
          emotionNote: emotionNote || null,
          situationalAnswers: situationalAnswers && situationalAnswers.length > 0 ? {
            create: situationalAnswers.map((ans: any) => ({
              questionId: ans.questionId,
              studentAnswer: ans.studentAnswer
            }))
          } : undefined
        },
        include: { situationalAnswers: true }
      });
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error('Assessment API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    if (user.role === 'teacher') {
      const submissions = await prisma.assessmentSubmission.findMany({ 
        orderBy: { updatedAt: 'desc' },
        include: { situationalAnswers: true }
      });
      return NextResponse.json({ success: true, submissions });
    } else {
      const submission = await prisma.assessmentSubmission.findUnique({ 
        where: { userId: user.userId },
        include: { situationalAnswers: true }
      });
      return NextResponse.json({ success: true, submission });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
