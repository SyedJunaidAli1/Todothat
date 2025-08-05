// app/api/notify-overdue-tasks/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { Knock } from "@knocklabs/node";

// Initialize Knock
const knockClient = new Knock(process.env.KNOCK_API_KEY!);

export async function GET() {
  const now = new Date();

  // Get all tasks that are overdue and not completed
  const overdueTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      dueDate: tasks.dueDate,
      userId: tasks.userId,
    })
    .from(tasks)
    .where(
      and(
        sql`${tasks.dueDate} IS NOT NULL`,
        sql`${tasks.dueDate} < ${now.toISOString()}`,
        eq(tasks.completed, false)
      )
    );

  let count = 0;

  // Loop through and notify each task’s user
  for (const task of overdueTasks) {
    try {
      await knockClient.workflows.trigger("task-overdue", {
        recipients: [task.userId], // assuming you used userId as Knock user_id
        data: {
          task: {
            title: task.title,
            dueDate: task.dueDate?.toISOString(),
          },
        },
      });

      count++;
    } catch (err) {
      console.error(`Failed to send Knock notification for task ${task.id}:`, err);
    }
  }

  return NextResponse.json({ status: "done", notified: count });
}
