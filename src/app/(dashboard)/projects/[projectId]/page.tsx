import ProjectPage from "./Projectpage";

export const metadata: Metadata = {
  title: "Projects | Todothat – Get Organized, Stay Productive",
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
      <ProjectPage />
    </div>
  );
};

export default page;
