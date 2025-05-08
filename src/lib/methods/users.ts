"use server"

import { auth } from '@/lib/auth'

export const signIn = async () => {
    await auth.api.signInEmail({
        body: {
            email: "syedjunaidali790@gmail.com",
            password: "pasword123",
        }
    })
} 
export const signUp = async () => {
    await auth.api.signUpEmail({
        body: {
            email: "syedjunaidali790@gmail.com",
            password: "pasword123",
            name: "Junaid",
        }
    })
} 