const { createClient } = require('@libsql/client');
require('dotenv').config();

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "PreClassReaction" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "preClassDiaryId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "emoji" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PreClassReaction_preClassDiaryId_fkey" FOREIGN KEY ("preClassDiaryId") REFERENCES "PreClassDiary" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "PreClassReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log("Successfully created PreClassReaction table!");

    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "PreClassReaction_preClassDiaryId_userId_key" ON "PreClassReaction"("preClassDiaryId", "userId");
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "PostClassReaction" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "postClassDiaryId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "emoji" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PostClassReaction_postClassDiaryId_fkey" FOREIGN KEY ("postClassDiaryId") REFERENCES "PostClassDiary" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "PostClassReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log("Successfully created PostClassReaction table!");

    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "PostClassReaction_postClassDiaryId_userId_key" ON "PostClassReaction"("postClassDiaryId", "userId");
    `);

  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

main().catch(console.error);
