"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, Task, deleteTask } from "@/lib/methods/tasks";
import { format, isTomorrow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface UpcomingPageProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

const UpcomingPage = ({ onAddTask, onEditTask }: UpcomingPageProps) => {
  const queryClient = useQueryClient();

  // State to track the current time, updated every minute (same as TodayPage, though not used in isOverdue)
  const [currentTime, setCurrentTime] = useState(new Date()); // June 17, 2025, 03:06 PM IST

  // Update currentTime every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000); // Update every minute

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Fetch tasks due after today using TanStack Query
  const today = new Date(); // June 17, 2025, 03:06 PM IST
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks", "Upcoming", today.toISOString().split("T")[0]],
    queryFn: () => getTasks(undefined, undefined, today, false), // Fetch tasks for all projects, due after today, not completed
  });

  // Mutation for deleting a task
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "Upcoming"] });
      toast.success("Task deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete task");
    },
  });

  // Format due date with "Tomorrow" if applicable
  const formatDueDate = (dueDate: Date | null) => {
    if (!dueDate) return "No due date";
    if (isTomorrow(dueDate)) {
      return `Tomorrow, ${format(dueDate, "HH:mm")} IST`;
    }
    return `${format(dueDate, "yyyy-MM-dd HH:mm")} IST`;
  };

  // Check if a task is overdue (same as TodayPage)
  const isOverdue = (dueDate: Date | null) => {
    if (!dueDate) return false;
    const now = new Date(); // June 17, 2025, 03:06 PM IST
    return dueDate < now;
  };

  // Default content when there are no upcoming tasks
  const defaultContent = (
    <div className="flex flex-col gap-2 px-6">
      <h2 className="text-2xl">Upcoming</h2>
      <h3>No upcoming tasks</h3>
      <p>Plan ahead by adding a task for the future!</p>
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
        <h2 className="text-2xl">Upcoming</h2>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 px-6">
        <h2 className="text-2xl">Upcoming</h2>
        <p className="text-red-500">Failed to load tasks: {error.message}</p>
      </div>
    );
  }

  // If there are no upcoming tasks, show the default content
  if (tasks.length === 0) {
    return defaultContent;
  }

  // If there are tasks, display them in a list
  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Upcoming</h2>
        <button
          onClick={onAddTask}
          className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
        >
          Add Task
        </button>
      </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-4 border rounded-lg shadow-sm ${
              isOverdue(task.dueDate) ? "border-red-500" : "border-emerald-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="text-sm">{task.description}</p>
                )}
                <p className="text-sm">
                  Due: {formatDueDate(task.dueDate)}
                  {isOverdue(task.dueDate) && (
                    <span className="text-red-500 ml-2">(Overdue)</span>
                  )}
                </p>
                <p className="text-sm">Project: {task.project}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditTask(task)}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the task "{task.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(task.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingPage;
