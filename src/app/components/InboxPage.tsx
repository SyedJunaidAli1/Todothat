// const InboxPage = () => {
//   return (
//     <>
//       <div className="flex flex-col gap-2 px-6 ">
//         <h2 className="text-2xl">Inbox</h2>
//         <h3>Capture now, plan later</h3>
//         <p>
//           Inbox is your go-to spot for quick task entry. Clear your mind now,
//           organize when you’re ready.
//         </p>
//         <button className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4">
//           Add Task
//         </button>
//       </div>
//     </>
//   );
// };

// export default InboxPage;


"use client";

import { useQuery } from "@tanstack/react-query";
import { getTasks, Task } from "@/lib/methods/tasks";
import { format } from "date-fns";

interface InboxPageProps {
  onAddTask: () => void;
}

const InboxPage = ({ onAddTask }: InboxPageProps) => {
  // Fetch tasks using TanStack Query
  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: ["tasks", "Inbox"],
    queryFn: () => getTasks("Inbox"),
  });

  // Default content when there are no tasks
  const defaultContent = (
    <div className="flex flex-col gap-2 px-6">
      <h2 className="text-2xl">Inbox</h2>
      <h3>Capture now, plan later</h3>
      <p>
        Inbox is your go-to spot for quick task entry. Clear your mind now,
        organize when you’re ready.
      </p>
      <button
        onClick={onAddTask}
        className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
      >
        Add Task
      </button>
    </div>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-6">
        <h2 className="text-2xl">Inbox</h2>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 px-6">
        <h2 className="text-2xl">Inbox</h2>
        <p className="text-red-500">Failed to load tasks: {error.message}</p>
      </div>
    );
  }

  // If there are no tasks, show the default content
  if (tasks.length === 0) {
    return defaultContent;
  }

  // If there are tasks, display them in a list
  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Inbox</h2>
        <button
          onClick={onAddTask}
          className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
        >
          Add Task
        </button>
      </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
            <p className="text-sm">
              Due: {task.dueDate ? format(task.dueDate, "yyyy-MM-dd HH:mm") + " IST" : "No due date"}
            </p>
            <p className="text-sm">Project: {task.project}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InboxPage;