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
    throw new Error("Failed to sign in");
  }
};


export const signUp = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  await auth.api.signUpEmail({
    body: { email, password, name },
  });
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