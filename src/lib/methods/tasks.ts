"use server"
// src/lib/methods/tasks.ts
import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createTask(
  title: string,
  description: string,
  dueDate: Date | undefined,
  project: string
) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized: Please log in to create a task.");
  }
  return db
    .insert(tasks)
    .values({
      userId: session.user.id,
      title,
      description,
      dueDate,
      project,
    })
    .returning();
}