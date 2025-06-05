import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from 'resend';


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
                html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
            });
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                await resend.emails.send({
                    from: "noreply@todothat.space",
                    to: user.email,
                    subject: "Verify your email address",
                    html: `
            <p>Hi ${user.name || "User"},</p>
            <p>Please verify your email by clicking the link below:</p>
            <p><a href="${url}">Verify Email</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn’t sign up, please ignore this email.</p>
          `,
                });
            } catch (error) {
                console.error("Verification email error:", error);
                throw new Error("Failed to send verification email");
            }
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    plugins: [nextCookies()],
});

