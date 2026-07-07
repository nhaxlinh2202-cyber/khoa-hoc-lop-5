const { createClient } = require('@libsql/client');
require('dotenv').config();

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const res = await client.execute('SELECT id, studentName, length(imageUrl) as imgLen, createdAt FROM PostClassDiary ORDER BY createdAt DESC');
  console.log(res.rows);
}

main().catch(console.error);
