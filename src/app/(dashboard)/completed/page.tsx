import { Metadata } from "next";
import Completepage from "./Completepage";

export const metadata: Metadata = {
  title: "Completed | Todothat – Get Organized, Stay Productive",
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
      <Completepage />
    </div>
  );
};

export default page;
