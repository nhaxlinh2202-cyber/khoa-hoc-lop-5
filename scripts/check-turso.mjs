import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  try {
    const rs = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables in Turso:", rs.rows.map(r => r.name));
  } catch (e) {
    console.error("Error connecting to Turso:", e);
  }
}
main();
