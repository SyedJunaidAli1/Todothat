"use server"
import { db } from "@/db/drizzle";
import { authClient } from '../auth-client';

export async function createTask(title: string, description?: string, dueDate?: Date, project?: string) {
    const session = await authClient.getSession();
    if (!session) throw new Error("Unauthorized");

    const [newTask] = await db
        .insert(tasks)
        .values({
            userId: session.user.id,
            title,
            description,
            dueDate,
            project: project || "Inbox",
        })
        .returning();
    return newTask;
}