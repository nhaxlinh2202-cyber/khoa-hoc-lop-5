import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  const result = await libsql.execute('SELECT * FROM PostClassDiary');
  console.log('PostClassDiary rows:', result.rows.length);
  result.rows.forEach(r => console.log(r.id, r.userId));
  
  const result2 = await libsql.execute('SELECT * FROM PreClassDiary');
  console.log('PreClassDiary rows:', result2.rows.length);
  result2.rows.forEach(r => console.log(r.id, r.userId));
}

main().catch(console.error);
