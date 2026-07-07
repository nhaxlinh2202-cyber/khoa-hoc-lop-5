import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    // 1. Tạo 1 user test
    const user = await prisma.user.create({
      data: { name: 'TestUser', role: 'student' }
    });
    console.log('Created User:', user);

    // 2. Tạo diary
    const diary = await prisma.preClassDiary.create({
      data: {
        userId: user.id,
        studentName: user.name,
        type: 'TU_LANH',
        foodName: 'Sữa chua',
        reason: 'Vì em thích',
      }
    });
    console.log('Created Diary:', diary);

    // 3. Xóa user test
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Cleaned up');
  } catch (e) {
    console.error('LỖI DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
