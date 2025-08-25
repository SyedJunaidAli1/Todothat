import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from 'resend';
import EmailVerification from "@/emails/EmailVerification";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            await resend.emails.send({
                from: "noreply@todothat.space",
                to: user.email,
                subject: "Reset your password",
                react: ResetPasswordEmail({
                    url
                })
            });
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                await resend.emails.send({
                    from: "noreply@todothat.space",
                    to: user.email,
                    subject: "Verify your email address -Todothat",
                    react: EmailVerification({
                        url,
                        user,
                    })
                });
            } catch (error) {
                console.error("Verification email error:", error);
                throw new Error("Failed to send verification email");
            }
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

        }
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    plugins: [nextCookies()],
});
