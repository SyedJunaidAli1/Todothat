'use server'
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "../auth";
import { headers } from "next/headers";

export async function createProject(id: string, name: string) {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        const [project] = await db
            .insert(projects)
            .values({ id, name, userId: session.user.id })
            .returning({ id: projects.id, name: projects.name });
        return project;
    } catch (error: any) {
        if (error.code === "23505") {
            throw new Error("Project name already exists for this user");
        }
        throw error;
    }
}

export async function deleteProjects(id: string) {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders })
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized")
    }
    await db.delete(projects).
        where(
            and(
                eq(projects.id, id),
                eq(projects.userId, session.user.id)
            )

        )
}

export async function getProjects(): Promise<Project[]> {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized");
    }

    return await db
        .select({ id: projects.id, name: projects.name })
        .from(projects)
        .where(eq(projects.userId, session.user.id))
        .orderBy(projects.name);
}