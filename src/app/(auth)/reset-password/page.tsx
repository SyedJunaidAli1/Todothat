import { Suspense } from "react";
import { ResetPasswordfrom } from "./ResetPasswordfrom";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResetPassword | Todothat – Get Organized, Stay Productive",
  description:
    "Manage your tasks, projects, and productivity with Todothat. Stay organized, prioritize, and get things done.",
  keywords: [
    "task manager",
    "todo app",
    "project management",
    "productivity",
    "Todothat",
  ],
};


// Parent page component
export default function Page() {
  return (
    // Wrap the dynamic child in Suspense (you can add a fallback like a loading spinner if desired)
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordfrom />
    </Suspense>
  );
}
