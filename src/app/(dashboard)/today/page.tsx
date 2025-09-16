import { Metadata } from "next";
import Todaypage from "./Todaypage"

export const metadata: Metadata = {
  title: "Today | Todothat – Get Organized, Stay Productive",
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
      <Todaypage />
    </div>
  )
}

export default page
