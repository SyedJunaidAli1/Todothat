// src/db/drizzle.ts
 // Ensure server-side execution
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import "dotenv/config"; // Load .env or .env.local


if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}

const sql = neon(process.env.POSTGRES_URL);
export const db = drizzle({ client: sql });