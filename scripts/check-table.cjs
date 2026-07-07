const { createClient } = require('@libsql/client');
require('dotenv').config();

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const res = await client.execute('SELECT * FROM PostForumComment LIMIT 1');
    console.log("Table exists! Rows:", res.rows.length);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

main().catch(console.error);
