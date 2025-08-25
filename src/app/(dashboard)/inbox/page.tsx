"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, Task, updateTask, createTask } from "@/lib/methods/tasks";
import { toast } from "sonner";
import { useState } from "react";
import { getProjects } from "@/lib/methods/projects";
import TaskComponent from "@/app/components/TaskComponent";
import TaskModal from "@/app/components/TaskModal";

const Page = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  const openAddTaskModal = () => {
    setEditingTask(null); // no task = create mode
    setModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };
  //Fetch Proects for task
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // Fetch all tasks (no due date filter, excluding completed)
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks", "Inbox"],
    queryFn: () => getTasks(undefined, undefined, undefined, false),
  });

  // Default content when there are no tasks
  const defaultContent = (
    <div className="flex flex-col gap-2 px-6 mt-18">
      <h2 className="text-2xl">Inbox</h2>
      <h3>No tasks in inbox</h3>
      <p>Add a task to get started!</p>
      <button
        onClick={openAddTaskModal}
        className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
      >
        Add Task
      </button>
    </div>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Inbox</h2>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Inbox</h2>
        <p className="text-red-500">Failed to load tasks: {error.message}</p>
      </div>
    );
  }

  // If there are no tasks, show the default content
  if (tasks.length === 0) {
    return defaultContent;
  }

  const handleSubmit = async ({
    title,
    description,
    dueDate,
    projectId,
  }: {
    title: string;
    description: string;
    dueDate?: Date;
    projectId: string | null;
  }) => {
    try {
      if (editingTask) {
        // Editing an existing task
        await updateTask(
          editingTask.id,
          title,
          description,
          dueDate,
          projectId || "",
          editingTask.completed
        );
      } else {
        // Creating a new task
        await createTask(
          title,
          description,
          dueDate ?? undefined,
          projectId || null
        );
      }

      setModalOpen(false); // close modal
      await queryClient.invalidateQueries({ queryKey: ["tasks", "Inbox"] });

      // refresh tasks
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  // If there are tasks, display them in a list
  return (
    <div className="flex flex-col gap-4 px-6 mt-18">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Inbox</h2>
        <button
          onClick={openAddTaskModal}
          className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 rounded-md text-sm px-4"
        >
          Add Task
        </button>
      </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <TaskComponent
            task={task}
            openEditTaskModal={openEditTaskModal}
            key={task.id}
          />
        ))}
      </ul>
      <TaskModal
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        editingTask={editingTask}
        onSubmit={handleSubmit}
        projects={projects}
      />
    </div>
  );
};

export default Page;
