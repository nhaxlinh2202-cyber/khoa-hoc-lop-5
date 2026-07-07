const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env' });

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.log("No TURSO_DATABASE_URL found, skipping Turso migration.");
    return;
  }

  const client = createClient({ url, authToken });

  try {
    console.log("Connecting to Turso...");
    
    // Create LessonReflection table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "LessonReflection" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "studentName" TEXT NOT NULL,
          "emotion" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL,
          CONSTRAINT "LessonReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    
    // Create unique index
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "LessonReflection_userId_key" ON "LessonReflection"("userId");
    `);

    console.log("Successfully created LessonReflection table on Turso!");
  } catch (error) {
    console.error("Failed to migrate Turso:", error);
  }
}

main();
