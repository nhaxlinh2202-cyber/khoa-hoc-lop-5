import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import dotenv from 'dotenv';
dotenv.config();

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  const post = await prisma.postClassDiary.findUnique({ where: { id: 'cmr9wda5j001b2fjzesiyo928' } });
  console.log('PostClassDiary:', post);
  const pre = await prisma.preClassDiary.findUnique({ where: { id: 'cmr9wda5j001b2fjzesiyo928' } });
  console.log('PreClassDiary:', pre);
}

main().catch(console.error).finally(() => prisma.$disconnect());
