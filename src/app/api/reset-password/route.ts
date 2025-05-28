import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { passwordResetToken, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"


export async function POST(req: Request) {
    const { token, password } = await req.json()

    if (!token || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const foundToken = await db.query.passwordResetToken.findFirst({
        where: eq(passwordResetToken.token, token),
    })


    if (!token || new Date() > new Date(foundToken.expiresAt)) {
        return NextResponse.json({ error: "Tokken invalid or expired" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    await db.update(user).set({ password: hashed }).where(eq(user.email, foundToken.email))

    await db.delete(passwordResetToken).where(eq(passwordResetToken.token, token))

    return NextResponse.json({ success: true })
}