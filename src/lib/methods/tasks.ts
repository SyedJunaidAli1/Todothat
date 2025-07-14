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
  projectId: string | null;
  userId: string;
  createdAt: Date;
  completed: boolean;
}

export async function getTasks(
  project?: string,
  dueDate?: Date,
  dueAfter?: Date,
  completed?: boolean
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
        project ? eq(tasks.projectId, project) : sql`TRUE`,
        completed !== undefined ? eq(tasks.completed, completed) : sql`TRUE`
      )
    );

  if (dueDate) {
    const startOfDay = new Date(dueDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dueDate);
    endOfDay.setHours(23, 59, 59, 999);

    query = query.where(
      and(
        eq(tasks.userId, session.user.id),
        project ? eq(tasks.projectId, project) : sql`TRUE`,
        completed !== undefined ? eq(tasks.completed, completed) : sql`TRUE`,
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
        completed !== undefined ? eq(tasks.completed, completed) : sql`TRUE`,
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
  projectId: string | null
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
    projectId,
    userId: session.user.id,
    completed: false, // Explicitly set to false
  });
}

export async function updateTask(
  taskId: number,
  title: string,
  description: string,
  dueDate: Date | undefined,
  projectId: string | null,
  completed: boolean
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
      projectId,
      completed,
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
