import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const libsql = createClient({
  url: 'file:./dev.db',
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  const posts = await prisma.postClassDiary.findMany();
  console.log('Post IDs (Local):', posts.map(p => p.id).join(', '));
  const pres = await prisma.preClassDiary.findMany();
  console.log('Pre IDs (Local):', pres.map(p => p.id).join(', '));
}

main().catch(console.error).finally(() => prisma.$disconnect());
