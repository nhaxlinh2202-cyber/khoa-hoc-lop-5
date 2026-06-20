import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AssessmentSubmission from '@/models/AssessmentSubmission';
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
  await connectDB();
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { situationalAnswers, emotion, emotionNote } = body;

    // We can either update an existing submission or create a new one. 
    // Usually, a student might submit answers one by one, or all at once.
    // Let's create a new record for every submission (or update if we want a single document per student).
    // For simplicity, we'll upsert (update if exists, create if not) based on userId.
    
    const updatedSubmission = await AssessmentSubmission.findOneAndUpdate(
      { userId: user.userId },
      { 
        $set: { studentName: user.name, emotion, emotionNote },
        // Append new answers to the array if they exist, or just overwrite if passed
        ...(situationalAnswers && situationalAnswers.length > 0 ? { $push: { situationalAnswers: { $each: situationalAnswers } } } : {})
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updatedSubmission });
  } catch (error: any) {
    console.error('Assessment API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // If teacher, return all submissions. If student, return only theirs.
    if (user.role === 'teacher') {
      const submissions = await AssessmentSubmission.find().sort({ updatedAt: -1 });
      return NextResponse.json({ success: true, submissions });
    } else {
      const submission = await AssessmentSubmission.findOne({ userId: user.userId });
      return NextResponse.json({ success: true, submission });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
