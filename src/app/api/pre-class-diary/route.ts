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
    const diariesRaw = await prisma.preClassDiary.findMany({
      orderBy: { createdAt: 'desc' },
      include: { PreClassReaction: true, comments: true }
    });
    console.log("PRE-CLASS DIARIES FETCHED FROM DB:", diariesRaw.length);

    const diaries = diariesRaw.map(d => ({
      ...d,
      likes: d.PreClassReaction.length,
      userReaction: d.PreClassReaction.find(r => r.userId === (user.userId || user.id))?.emoji || null,
      allReactions: d.PreClassReaction
    }));
    
    const myDiary = await prisma.preClassDiary.findFirst({
      where: { userId: user.id || user.userId }
    });

    return NextResponse.json({ 
      success: true, 
      diaries, 
      hasSubmitted: !!myDiary,
      myDiary,
      currentUser: { userId: user.id || user.userId, role: user.role }
    });
  } catch (err: any) {
    console.error("GET PRE-CLASS ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const userId = user.id || user.userId;

    if (data.id) {
      const existing = await prisma.preClassDiary.findUnique({ where: { id: data.id } });
      if (!existing) {
        return NextResponse.json({ error: `Forbidden - not found ${data.id}` }, { status: 403 });
      }
      if (existing.userId !== userId) {
        return NextResponse.json({ error: `Forbidden - mismatch DB: ${existing.userId} != Token: ${userId}` }, { status: 403 });
      }
      
      const updatedDiary = await prisma.preClassDiary.update({
        where: { id: data.id },
        data: {
          type: data.type,
          foodName: data.foodName,
          color: data.color || null,
          state: data.state || null,
          taste: data.taste || null,
          reason: data.reason || null,
          imageUrl: data.imageUrl || null,
        }
      });
      return NextResponse.json({ success: true, diary: updatedDiary });
    }

    const newDiary = await prisma.preClassDiary.create({
      data: {
        userId: userId,
        studentName: user.name,
        type: data.type,
        foodName: data.foodName,
        color: data.color || null,
        state: data.state || null,
        taste: data.taste || null,
        reason: data.reason || null,
        imageUrl: data.imageUrl || null,
      }
    });
    return NextResponse.json({ success: true, diary: newDiary });
  } catch (error: any) {
    console.error("DIARY SUBMIT ERROR:", error);
    return NextResponse.json({ error: 'DB Error: ' + (error.message || error.toString()) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { diaryId, emoji } = await req.json();
  if (!diaryId || !emoji) return NextResponse.json({ error: 'Missing diaryId or emoji' }, { status: 400 });

  const currentUserId = user.userId || user.id;

  const reaction = await prisma.preClassReaction.upsert({
    where: {
      preClassDiaryId_userId: {
        preClassDiaryId: diaryId,
        userId: currentUserId
      }
    },
    create: {
      preClassDiaryId: diaryId,
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

  const diary = await prisma.preClassDiary.findUnique({ where: { id: diaryId } });
  if (!diary) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role !== 'teacher') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.preClassDiary.delete({ where: { id: diaryId } });
  return NextResponse.json({ success: true });
}
