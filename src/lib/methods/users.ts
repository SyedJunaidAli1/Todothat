"use server"
import { auth } from '@/lib/auth'
import { headers } from 'next/headers';
import { authClient } from '../auth-client';

export const signIn = async (email: string, password: string) => {
  try {
    const res = await auth.api.signInEmail({
      body: { email, password },
    });
    return res;
  } catch (error: any) {
    if (error.status === 403) {
      throw new Error("Please verify your email address before signing in");
    }
    throw new Error(error.message || "Failed to sign in");
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

export const sendVerify = async (email: string) => {
  try {
    const requestHeaders = await headers();
    const headersObject = Object.fromEntries(requestHeaders);
    // Assume BetterAuth has a resendVerificationEmail method or similar
    await authClient.resendVerificationEmail({
      body: { email },
      headers: headersObject
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (error: any) {
    console.error("Send verification error:", error);
    throw new Error(error.message || "Failed to send verification email");
  }
};