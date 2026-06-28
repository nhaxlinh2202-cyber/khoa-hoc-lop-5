import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { pin, studentName } = body;

    let user;

    if (pin) {
      // Teacher Login
      if (pin !== '1234') {
        return NextResponse.json({ error: 'Mã PIN không đúng' }, { status: 401 });
      }

      user = await prisma.user.findFirst({ where: { role: 'teacher' } });
      if (!user) {
        user = await prisma.user.create({ data: { name: 'Teacher', role: 'teacher', pin: '1234' } });
      }
    } else if (studentName) {
      // Student Login
      if (!studentName.trim()) {
        return NextResponse.json({ error: 'Tên không được để trống' }, { status: 400 });
      }

      user = await prisma.user.findFirst({ where: { name: studentName, role: 'student' } });
      if (!user) {
        user = await prisma.user.create({ data: { name: studentName, role: 'student' } });
      }
    } else {
      return NextResponse.json({ error: 'Thiếu thông tin đăng nhập' }, { status: 400 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only Cookie
    const serialized = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
    });
    
    response.headers.set('Set-Cookie', serialized);

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
