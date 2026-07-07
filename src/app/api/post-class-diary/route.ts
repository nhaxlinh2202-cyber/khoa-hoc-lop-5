import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
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

  try {
    const diariesRaw = await prisma.postClassDiary.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reactions: true, comments: true }
    });

    const diaries = diariesRaw.map(d => ({
      ...d,
      likes: d.reactions.length,
      userReaction: d.reactions.find(r => r.userId === (user.userId || user.id))?.emoji || null,
      allReactions: d.reactions
    }));
    
    const myDiary = await prisma.postClassDiary.findFirst({
      where: { userId: user.userId || user.id }
    });

    return NextResponse.json({ 
      success: true, 
      diaries, 
      hasSubmitted: !!myDiary,
      myDiary,
      currentUser: { userId: user.userId || user.id, role: user.role }
    });
  } catch (error: any) {
    console.error("GET DIARIES ERROR:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const userId = user.userId || user.id;

  if (data.id) {
    const existing = await prisma.postClassDiary.findUnique({ where: { id: data.id } });
    if (!existing) {
      console.log("Not existing!", data.id);
      return NextResponse.json({ error: `Forbidden - not found ${data.id}` }, { status: 403 });
    }
    if (existing.userId !== userId) {
      console.log("Mismatch!", "DB:", existing.userId, "Token:", userId);
      return NextResponse.json({ error: `Forbidden - mismatch DB: ${existing.userId} != Token: ${userId}` }, { status: 403 });
    }
    const updatedDiary = await prisma.postClassDiary.update({
      where: { id: data.id },
      data: {
        timeTaken: data.timeTaken,
        color: data.color,
        taste: data.taste,
        state: data.state,
        smoothness: data.smoothness,
        rating: data.rating,
        imageUrl: data.imageUrl,
        notes: data.notes
      }
    });
    return NextResponse.json({ success: true, diary: updatedDiary });
  }

  const newDiary = await prisma.postClassDiary.create({
    data: {
      userId: userId,
      studentName: user.name,
      timeTaken: data.timeTaken,
      color: data.color,
      taste: data.taste,
      state: data.state,
      smoothness: data.smoothness,
      rating: data.rating,
      imageUrl: data.imageUrl,
      notes: data.notes
    }
  });
  return NextResponse.json({ success: true, diary: newDiary });
}

export async function PUT(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { diaryId, emoji } = await req.json();
  if (!diaryId || !emoji) return NextResponse.json({ error: 'Missing diaryId or emoji' }, { status: 400 });

  const currentUserId = user.userId || user.id;

  const reaction = await prisma.postClassReaction.upsert({
    where: {
      postClassDiaryId_userId: {
        postClassDiaryId: diaryId,
        userId: currentUserId
      }
    },
    create: {
      postClassDiaryId: diaryId,
      userId: currentUserId,
      emoji: emoji
    },
    update: {
      emoji: emoji
    }
  });

  return NextResponse.json({ success: true, reaction });
}

export async function DELETE(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const diaryId = searchParams.get('id');
  if (!diaryId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const diary = await prisma.postClassDiary.findUnique({ where: { id: diaryId } });
  if (!diary) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role !== 'teacher') return NextResponse.json({ error: 'Forbidden. Only teachers can delete.' }, { status: 403 });

  await prisma.postClassDiary.delete({ where: { id: diaryId } });
  return NextResponse.json({ success: true });
}
