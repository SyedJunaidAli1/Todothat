"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, Task, updateTask, createTask } from "@/lib/methods/tasks";
import { toast } from "sonner";
import { useState } from "react";
import TaskModal from "@/app/components/TaskModal"; // Replace path with your actual modal
import TaskComponent from "@/app/components/TaskComponent";

const Page = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks with future due dates (excluding completed)
  const today = new Date();
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks", "Upcoming"],
    queryFn: () => getTasks(undefined, undefined, today, false),
  });

  // Open Add Task modal
  const openAddTaskModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // Open Edit Task modal
  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Handle submit for add/edit
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
        // Edit
        await updateTask(
          editingTask.id,
          title,
          description,
          dueDate,
          projectId || "",
          editingTask.completed
        );
        toast.success("Task updated!");
      } else {
        // Add
        await createTask(
          title,
          description,
          dueDate ?? undefined,
          projectId || null
        );
        toast.success("Task created!");
      }
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["tasks", "Upcoming"] });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Upcoming</h2>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Upcoming</h2>
        <p className="text-red-500">Failed to load tasks: {error.message}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Upcoming</h2>
        <h3>No upcoming tasks</h3>
        <p>Add a task with a future due date to get started!</p>
        <button
          onClick={openAddTaskModal}
          className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
        >
          Add Task
        </button>
        <TaskModal
          isOpen={isModalOpen}
          onOpenChange={setModalOpen}
          editingTask={editingTask}
          onSubmit={handleSubmit}
          projects={[]} // Fetch & pass projects if required
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-6 mt-18">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Upcoming</h2>
        <button
          onClick={openAddTaskModal}
          className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
        >
          Add Task
        </button>
      </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <TaskComponent
            key={task.id}
            task={task}
            openEditTaskModal={openEditTaskModal}
          />
        ))}
      </ul>
      <TaskModal
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        editingTask={editingTask}
        onSubmit={handleSubmit}
        projects={[]} // Fetch & pass projects as needed
      />
    </div>
  );
};

export default Page;
