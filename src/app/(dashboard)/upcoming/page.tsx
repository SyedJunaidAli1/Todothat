import { Metadata } from "next";
import Upcomingpage from "./Upcomingpage";

export const metadata: Metadata = {
  title: "Upcoming | Todothat – Get Organized, Stay Productive",
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
      <Upcomingpage />
    </>
  );
};

export default page;
