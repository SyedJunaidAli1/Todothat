"use server"
import { auth } from '@/lib/auth'
import { headers } from 'next/headers';
import { Resend } from "resend";
import { createResetToken, saveTokenToDB } from "../tokenUtils"; // you write these

export const signIn = async (email: string, password: string) => {
  try {
    const res = await auth.api.signInEmail({
      body: { email, password },
    });
    // Optional: return success message
    return res
  } catch (error) {
    throw new Error("Failed to Sign in");
  }
};


export const signUp = async (name: string, email: string, password: string) => {
  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
  } catch (error) {
    throw new Error("Failed to Sign up")
  }
};

export const signOut = async () => {
  try {
    console.log("Attempting signOut");
    const requestHeaders = await headers()
    const headersObject = Object.fromEntries(requestHeaders)
    await auth.api.signOut({ headers: headersObject });
    return { success: true }
  } catch (error) {
    console.error("Signout error", error);
    throw error instanceof Error ? error : new Error("Failed to sign out");
  }
}


const resend = new Resend(process.env.RESEND_API_KEY!);
export async function sendPasswordReset(email: string) {
  const token = createResetToken(); // generate a UUID or JWT
  const resetLink = `http://localhost:3000/Reset-password?token=${token}`;

  await saveTokenToDB(email, token); // store token with expiration

  await resend.emails.send({
    from: "noreply@todothat.space",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}
