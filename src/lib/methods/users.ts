"use server"
import { auth } from '@/lib/auth'


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


// export const signIn = async () => {
//   await auth.api.signInEmail({
//     body: {
//       email: "yellow@gmail.com",
//       password: "yello9669",
//     }
//   })
// }

// export const signUp = async () => {
//  await auth.api.signUpEmail({
//   body: {
//     email: "yellow@gmail.com",
//     password: "yello9669",
//     name: "yellow"
//   }
// });
// }