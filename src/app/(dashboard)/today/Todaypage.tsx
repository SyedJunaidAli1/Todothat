"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, Task, updateTask, createTask } from "@/lib/methods/tasks";
import { useState } from "react";
import TaskModal from "@/app/components/TaskModal"; // Make sure this is your modal
import TaskComponent from "@/app/components/TaskComponent";

// ---- MAIN PAGE ----
const Todaypage = () => {
  const queryClient = useQueryClient();

  // -- Modal and editing state
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // For "today" filter
  const today = new Date();

  // Fetch tasks due today, incomplete only
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks", "Today", today.toISOString().split("T")[0]],
    queryFn: () => getTasks(undefined, today, undefined, false),
  });

  // ---- MODAL OPENERS ----
  const openAddTaskModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // ---- HANDLE ADD/EDIT ----
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
        await updateTask(
          editingTask.id,
          title,
          description,
          dueDate,
          projectId || "",
          editingTask.completed
        );
      } else {
        await createTask(
          title,
          description,
          dueDate ?? undefined,
          projectId || null
        );
      }
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["tasks", "Today"] });
    } catch (err: any) {
      throw new err();
    }
  };

  // ---- UI ----

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Today</h2>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Today</h2>
        <p className="text-red-500">Failed to load tasks: {error.message}</p>
      </div>
    );
  }

  // Default content when nothing for today
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Today</h2>
        <h3>No tasks for today</h3>
        <p>Add a task to get started with your day!</p>
        <button
          onClick={openAddTaskModal}
          className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 rounded-md text-sm px-4"
        >
          Add Task
        </button>
        {/* The modal is still always available */}
        <TaskModal
          isOpen={isModalOpen}
          onOpenChange={setModalOpen}
          editingTask={editingTask}
          onSubmit={handleSubmit}
          projects={[]} // Or fetch projects if required
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-6 mt-18">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Today</h2>
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
        projects={[]} // Or fetch projects if you want
      />
    </div>
  );
};

export default Todaypage;
