const { createClient } = require('@libsql/client');
require('dotenv').config();

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    await client.execute('ALTER TABLE "PreClassDiary" ADD COLUMN "taste" TEXT;');
    console.log('Thêm cột taste thành công vào bảng PreClassDiary trên Turso!');
  } catch (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('Cột taste đã tồn tại.');
    } else {
      console.error('Lỗi:', err.message);
    }
  }
}

main();
