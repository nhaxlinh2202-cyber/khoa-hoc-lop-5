const { execSync } = require('child_process');
require('dotenv').config();

process.env.DATABASE_URL = process.env.TURSO_DATABASE_URL;

try {
  execSync('node ./node_modules/prisma/build/index.js db push --skip-generate', { env: process.env, stdio: 'inherit' });
  console.log("Successfully pushed to Turso!");
} catch (e) {
  console.error("Failed to push:", e.message);
}
