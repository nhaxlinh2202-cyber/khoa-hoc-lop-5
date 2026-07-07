const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const diaries = await prisma.preClassDiary.findMany({
    where: { type: 'THUC_TE', imageUrl: { not: null } },
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(diaries, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
