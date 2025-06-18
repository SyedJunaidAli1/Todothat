'use server'
import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Define the Task type (based on your schema)
export interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  project: string;
  userId: string;
  createdAt: Date;
}

export async function getTasks(
  project?: string,
  dueDate?: Date,
  dueAfter?: Date
): Promise<Task[]> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  let query = db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, session.user.id),
        project ? eq(tasks.project, project) : sql`TRUE`
      )
    )
    .orderBy(tasks);

  if (dueDate) {
    const startOfDay = new Date(dueDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dueDate);
    endOfDay.setHours(23, 59, 59, 999);

    query = query.where(
      and(
        eq(tasks.userId, session.user.id),
        project ? eq(tasks.project, project) : sql`TRUE`,
        sql`${tasks.dueDate} >= ${startOfDay.toISOString()}`,
        sql`${tasks.dueDate} <= ${endOfDay.toISOString()}`
      )
    );
  }

  if (dueAfter) {
    const endOfDay = new Date(dueAfter);
    endOfDay.setHours(23, 59, 59, 999);

    query = query.where(
      and(
        eq(tasks.userId, session.user.id),
        project ? eq(tasks.project, project) : sql`TRUE`,
        sql`${tasks.dueDate} > ${endOfDay.toISOString()}`
      )
    );
  }

  const result = await query;
  return result;
}

export async function createTask(
  title: string,
  description: string,
  dueDate: Date | undefined,
  project: string
) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  await db.insert(tasks).values({
    title,
    description,
    dueDate,
    project,
    userId: session.user.id,
  });
}

export async function updateTask(
  taskId: number,
  title: string,
  description: string,
  dueDate: Date | undefined,
  project: string
) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(tasks)
    .set({
      title,
      description,
      dueDate,
      project,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tasks.id, taskId),
        eq(tasks.userId, session.user.id)
      )
    );
}

export async function deleteTask(taskId: number) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(tasks)
    .where(
      and(
        eq(tasks.id, taskId),
        eq(tasks.userId, session.user.id)
      )
    );
}