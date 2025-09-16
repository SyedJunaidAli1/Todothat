"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, Task } from "@/lib/methods/tasks";
import { format } from "date-fns";

const Completepage = () => {
  const queryClient = useQueryClient();

  // Fetch completed tasks using TanStack Query
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks", "Completed"],
    queryFn: () => getTasks(undefined, undefined, undefined, true), // Fetch all completed tasks
  });

  // Format due date for display
  const formatDueDate = (dueDate: Date | null) => {
    if (!dueDate) return "No due date";
    return `${format(dueDate, "yyyy-MM-dd HH:mm")} IST`;
  };

  // Default content when there are no completed tasks
  const defaultContent = (
    <div className="flex flex-col gap-2 px-6 mt-18">
      <h2 className="text-2xl">Completed</h2>
      <h3>No completed tasks yet</h3>
      <p>Finish some tasks to see them here!</p>
    </div>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Completed</h2>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 px-6 mt-18">
        <h2 className="text-2xl">Completed</h2>
        <p className="text-red-500">Failed to load tasks: {error.message}</p>
      </div>
    );
  }

  // If there are no completed tasks, show the default content
  if (tasks.length === 0) {
    return defaultContent;
  }

  // If there are tasks, display them in a list
  return (
    <div className="flex flex-col gap-4 px-6 mt-18">
      <h2 className="text-2xl">Completed</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border border-emerald-200 rounded-lg shadow-s"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="text-s">{task.description}</p>
                )}
                <p className="text-sm">Due: {formatDueDate(task.dueDate)}</p>
                <p className="text-md">
                  {" "}
                  Project: {task.projectName ? task.projectName : "Inbox"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Completepage;
