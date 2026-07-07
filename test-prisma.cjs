const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Testing Prisma...");
    const res = await prisma.lessonReflection.findFirst({
      where: { userId: "cllz1234" }
    });
    console.log("Success:", res);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
