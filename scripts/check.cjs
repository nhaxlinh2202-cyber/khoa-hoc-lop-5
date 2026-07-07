const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.postClassDiary.findUnique({ where: { id: 'cmr9wda5j001b2fjzesiyo928' } });
  console.log('PostClassDiary:', post);
  const pre = await prisma.preClassDiary.findUnique({ where: { id: 'cmr9wda5j001b2fjzesiyo928' } });
  console.log('PreClassDiary:', pre);
}

main().catch(console.error).finally(() => prisma.$disconnect());
