import React from "react";
import Forgotpasswordform from "./Forgotpasswordform";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ForgotPassword | Todothat – Get Organized, Stay Productive",
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

const page = () => {
  return (
    <div>
      <Forgotpasswordform />
    </div>
  );
};

export default page;
