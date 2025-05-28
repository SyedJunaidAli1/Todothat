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
        sendResetPassword: async ({ user, url, token }, request) => {
            await resend({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            });
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    plugins: [nextCookies()],
});

