import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Todothat – Get Organized, Stay Productive",
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


const page = () => (
  <>
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold">Welcome</h2>
      <p>Select an item to view its content.</p>
    </div>
  </>
);

export default page;
