import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@altair/config";
import * as schema from "./schema.js";

let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!db) {
    client = postgres(env().DATABASE_URL, { max: 10 });
    db = drizzle(client, { schema });
  }
  return db;
}

export async function pingDb(): Promise<boolean> {
  try {
    const sql = postgres(env().DATABASE_URL, { max: 1, connect_timeout: 2 });
    await sql`select 1`;
    await sql.end({ timeout: 1 });
    return true;
  } catch {
    return false;
  }
}

export { schema };
