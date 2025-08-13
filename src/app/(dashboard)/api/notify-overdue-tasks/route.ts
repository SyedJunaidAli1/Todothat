import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { and, eq, isNotNull, lt, inArray } from "drizzle-orm";
import { Knock } from "@knocklabs/node";

export const dynamic = "force-dynamic";

const knockClient = new Knock(process.env.KNOCK_API_KEY!);

export async function GET() {
  try {
    const now = new Date();

    // Only pick tasks that are: have a due date, are now overdue, not completed, and NOT notified yet
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
          isNotNull(tasks.dueDate),
          lt(tasks.dueDate, now),
          eq(tasks.completed, false),
          eq(tasks.overdueNotified, false)
        )
      );

    if (overdueTasks.length === 0) {
      return NextResponse.json({ status: "ok", notified: 0, failures: 0, taskIds: [] });
    }

    // Send notifications
    const results = await Promise.allSettled(
      overdueTasks.map((t) =>
        knockClient.workflows.trigger("task-overdue", {
          recipients: [t.userId],
          data: {
            task: {
              id: t.id,
              title: t.title,
              dueDate: t.dueDate?.toISOString(),
            },
          },
        })
      )
    );

    // Mark only successful ones as notified
    const successIds: number[] = [];
    const failed: { id: number; reason: string }[] = [];

    results.forEach((r, i) => {
      const t = overdueTasks[i];
      if (r.status === "fulfilled") successIds.push(t.id);
      else failed.push({ id: t.id, reason: String(r.reason) });
    });

    if (successIds.length > 0) {
      await db
        .update(tasks)
        .set({ overdueNotified: true })
        .where(inArray(tasks.id, successIds));
    }

    return NextResponse.json({
      status: "ok",
      notified: successIds.length,
      failures: failed.length,
      taskIds: successIds,
      failed,
    });
  } catch (err) {
    console.error("notify-overdue-tasks error:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
