'use server'
import { db } from "@/db/drizzle";
import { projects, tasks } from "@/db/schema";
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
  overdueNotified: boolean;
}

export async function getTasks(
  project?: string,
  dueDate?: Date,
  dueAfter?: Date,
  completed?: boolean
): Promise<(Task & { projectName: string | null })[]> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  let query = db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      dueDate: tasks.dueDate,
      projectId: tasks.projectId,
      userId: tasks.userId,
      createdAt: tasks.createdAt,
      completed: tasks.completed,
      projectName: projects.name, // join result
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
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
        project ? eq(tasks.projectId, project) : sql`TRUE`,
        completed !== undefined ? eq(tasks.completed, completed) : sql`TRUE`,
        sql`${tasks.dueDate} > ${endOfDay.toISOString()}`
      )
    );
  }

  return await query;
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

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const newDue = dueDate ?? null;

  // Reset the notification flag when task is no longer overdue
  const dueMovedToFuture = newDue !== null && newDue > now;
  const dueCleared = newDue === null;
  const markedComplete = completed === true;

  const shouldResetOverdueFlag =
    dueMovedToFuture || dueCleared || markedComplete;

  await db
    .update(tasks)
    .set({
      title,
      description,
      dueDate: newDue,
      projectId,
      completed,
      ...(shouldResetOverdueFlag ? { overdueNotified: false } : {}),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));
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
