import Inboxpage from "./Inboxpage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox | Todothat – Get Organized, Stay Productive",
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
    <>
      <Inboxpage />
    </>
  );
};

export default page;
