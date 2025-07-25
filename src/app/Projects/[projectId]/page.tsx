"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getTasks, createTask, updateTask, Task } from "@/lib/methods/tasks";
import { getProjects } from "@/lib/methods/projects";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TaskComponent from "@/app/components/TaskComponent";
import TaskModal from "@/app/components/TaskModal";

export default function ProjectPage() {
  const queryClient = useQueryClient();
  const { projectId } = useParams() as { projectId: string };

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch all projects (for validation and modal project dropdown if needed)
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const project = projects.find((p) => p.id === projectId);
  const isValid = !!project;

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId, undefined, undefined, false), // 👈 only incomplete
    enabled: !!projectId,
  });

  const openAddTaskModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async ({
    title,
    description,
    dueDate,
    projectId: _unused,
  }: {
    title: string;
    description: string;
    dueDate?: Date;
    projectId: string | null;
  }) => {
    try {
      if (editingTask) {
        await updateTask(
          editingTask.id,
          title,
          description,
          dueDate,
          projectId,
          editingTask.completed
        );
        toast.success("Task updated!");
      } else {
        await createTask(title, description, dueDate ?? undefined, projectId);
        toast.success("Task created!");
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  if (!isValid) {
    return <div className="p-4 text-red-500">Project not found.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mt-16">
        <h2 className="text-2xl">{project?.name}</h2>
        <Button onClick={openAddTaskModal}> Add Task</Button>
      </div>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load tasks: {error.message}</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks in this project.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskComponent
              key={task.id}
              task={task}
              openEditTaskModal={openEditTaskModal}
              invalidateKey={["tasks", projectId]}
            />
          ))}
        </ul>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        editingTask={editingTask}
        onSubmit={handleSubmit}
        projects={projects}
      />
    </div>
  );
}
