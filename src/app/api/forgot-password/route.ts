import { NextResponse } from "next/server";
import { sendPasswordReset } from "@/lib/methods/users"; // or wherever you wrote it

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await sendPasswordReset(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
