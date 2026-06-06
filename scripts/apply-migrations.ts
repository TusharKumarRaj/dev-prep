/**
 * Applies prisma/migrations/*.sql to Turso (or any libsql database).
 * Run after setting TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env
 *
 *   npm run db:deploy
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("Missing TURSO_DATABASE_URL or DATABASE_URL");
  process.exit(1);
}

if (url.startsWith("libsql://") && !authToken) {
  console.error("Missing TURSO_AUTH_TOKEN for Turso database");
  process.exit(1);
}

const client = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

const migrationsPath = join(process.cwd(), "prisma", "migrations");
const folders = readdirSync(migrationsPath)
  .filter((name) => name !== "migration_lock.toml")
  .sort();

async function main() {
  for (const folder of folders) {
    const sqlPath = join(migrationsPath, folder, "migration.sql");
    const sql = readFileSync(sqlPath, "utf8");
    console.log(`Applying ${folder}...`);
    await client.executeMultiple(sql);
  }
  console.log("All migrations applied.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
