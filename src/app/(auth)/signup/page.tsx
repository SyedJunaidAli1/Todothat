import { Metadata } from "next";
import Signupform from "./Signupform";

export const metadata: Metadata = {
  title: "Signup | Todothat – Get Organized, Stay Productive",
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
      <Signupform />
    </div>
  );
};

export default page;
