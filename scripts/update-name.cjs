const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
require('dotenv').config();

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.updateMany({
    where: { name: 'Bé Yêu' },
    data: { name: 'Lớp 5A' }
  });
  console.log("Updated name to Lớp 5A in DB");
}
main();
