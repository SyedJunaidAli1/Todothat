"use server"
import { auth } from '@/lib/auth'
import { headers } from 'next/headers';

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
