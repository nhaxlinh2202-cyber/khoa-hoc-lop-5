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
  const posts = await prisma.postClassDiary.findMany();
  console.log('Post IDs:', posts.map(p => p.id).join(', '));
  const pres = await prisma.preClassDiary.findMany();
  console.log('Pre IDs:', pres.map(p => p.id).join(', '));
}

main().catch(console.error).finally(() => prisma.$disconnect());
