import { Metadata } from "next";
import Signinform from "./Signinform";

export const metadata: Metadata = {
  title: "Signin | Todothat – Get Organized, Stay Productive",
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
      <Signinform />
    </div>
  );
};

export default page;
