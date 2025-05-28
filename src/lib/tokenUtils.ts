import { randomUUID } from "crypto";
import { db } from "@/db/drizzle"; // your Drizzle db instance
import { passwordResetToken } from "@/db/schema"; // your table schema
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";

// 1. Create a reset token
export function createResetToken(): string {
  return uuidv4(); // or use JWT if you want to encode user info
}

// 2. Save token to DB
export async function saveTokenToDB(email: string, token: string) {
  const expiresAt = addHours(new Date(), 1); // expires in 1 hour

  await db.insert(passwordResetToken).values({
    id: uuidv4(),
    email,
    token,
    expiresAt,
    createdAt: new Date(), // ✅ Now correctly part of the same object
  });
}
