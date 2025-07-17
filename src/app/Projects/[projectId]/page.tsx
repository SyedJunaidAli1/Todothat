// app/project/[projectId]/page.tsx

import { getTasks } from "@/lib/methods/tasks";
import { getProjects } from "@/lib/methods/projects";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface Props {
  params: {
    projectId: string;
  };
}

export default async function ProjectPage({ params }: Props) {
  const projects = await getProjects();
  const project = projects.find((p) => p.id == params.projectId);

  if (!project) return notFound();

  const tasks = await getTasks(project.id);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">{project.name}</h2>
      <Button>+ Add Task</Button>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks in this project.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="bg-muted p-2 rounded">
              <div className="flex justify-between items-center">
                <div>{task.title}</div>
                <Button size="sm">Edit</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
