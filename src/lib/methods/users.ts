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
    const res = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    const user = res?.user;

    if (!user?.id) {
      console.error("User creation failed, response was:", res);
      throw new Error("User creation failed");
    }

    try {
      // ✅ Try to create Knock user
      const knockRes = await fetch(`https://api.knock.app/v1/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.KNOCK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name || "User",
        }),
      });

      if (!knockRes.ok && knockRes.status !== 422) {
        const errorText = await knockRes.text();
        console.error("Knock user creation failed:", errorText);
        throw new Error("Knock user creation failed");
      }

    } catch (knockError) {
      console.warn("Knock user might already exist or failed to create:", knockError);
      // Continue anyway if it's a 422
    }

    return user;
  } catch (error) {
    console.error("Signup or Knock user creation failed:", error);
    throw new Error("Failed to Sign up");
  }
};


export const signOut = async () => {
  try {
    console.log("Attempting signOut");
    const requestHeaders = await headers()
    const headersObject = Object.fromEntries(requestHeaders)
    await auth.api.signOut({ headers: headersObject })
    return { success: true }
  } catch (error) {
    console.error("Signout error", error);
    throw error instanceof Error ? error : new Error("Failed to sign out");
  }
}

export const sendVerify = async (email: string) => {
  try {
    await authClient.sendVerificationEmail({
      email: email,
      callbackURL: "/dashboard", // The redirect URL after verification
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (error: any) {
    console.error("Send verification error:", error);
    throw new Error(error.message || "Failed to send verification email");
  }
};

export async function resetPassword(password: string, token: string) {
  try {

    const result: any = await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });
    return { success: true, message: "Password Reset" };
  } catch (error: any) {
    console.error("resetPassword (Better Auth SDK) error:", error);
    throw new Error(error.message || "Something went wrong. Try again.");
  }
}