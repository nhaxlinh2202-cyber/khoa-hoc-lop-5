import { createClient } from '@libsql/client';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  try {
    console.log("1. Đang phá dỡ các bảng dữ liệu cũ trên đám mây...");
    await client.executeMultiple(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS "SituationalAnswer";
      DROP TABLE IF EXISTS "AssessmentSubmission";
      DROP TABLE IF EXISTS "Diary";
      DROP TABLE IF EXISTS "PostClassDiary";
      DROP TABLE IF EXISTS "ForumComment";
      DROP TABLE IF EXISTS "PreClassDiary";
      DROP TABLE IF EXISTS "Progress";
      DROP TABLE IF EXISTS "User";
      PRAGMA foreign_keys = ON;
    `);
    
    console.log("2. Đang xây dựng lại bản đồ cơ sở dữ liệu mới tinh...");
    const sql = fs.readFileSync('setup.sql', 'utf8');
    await client.executeMultiple(sql);
    
    console.log("3. ĐỒNG BỘ TURSO THÀNH CÔNG 100%!");
  } catch (e) {
    console.error("LỖI RỒI MÁ ƠI:", e);
  }
}
main();
