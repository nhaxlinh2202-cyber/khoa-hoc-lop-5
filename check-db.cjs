const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const diaries = await prisma.postClassDiary.findMany();
  console.log("Diaries count:", diaries.length);
  if (diaries.length > 0) {
    console.log(diaries[0]);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
