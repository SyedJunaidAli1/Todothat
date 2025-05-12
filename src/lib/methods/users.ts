"use server"
import bcrypt from "bcryptjs"
import { auth } from '@/lib/auth'
import { db } from "@/db/drizzle";
import { user } from '@/db/schema'

export const signIn = async () => {
  await auth.api.signInEmail({
    body: {
      email: "yellow@gmail.com",
      password: "yello9669",
    }
  })
}

export const signUp = async () => {
 await auth.api.signUpEmail({
  body: {
    email: "yellow@gmail.com",
    password: "yello9669",
    name: "yellow"
  }
});
}
