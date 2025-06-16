"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, Task, deleteTask } from "@/lib/methods/tasks";
import { format, isToday, isTomorrow } from "date-fns";
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

interface InboxPageProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

const InboxPage = ({ onAddTask, onEditTask }: InboxPageProps) => {
  const queryClient = useQueryClient();

  // Fetch tasks using TanStack Query
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks", "Inbox"],
    queryFn: () => getTasks("Inbox"),
  });

  // Mutation for deleting a task
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "Inbox"] });
    },
    onError: (err: any) => {
      console.error("Failed to delete task:", err.message);
    },
  });

  // Format due date with "Today" or "Tomorrow" if applicable
  const formatDueDate = (dueDate: Date | null) => {
    if (!dueDate) return "No due date";
    const today = new Date(); // Current date: June 13, 2025, 03:42 PM IST
    if (isToday(dueDate)) {
      return `Today, ${format(dueDate, "HH:mm")} IST`;
    }
    if (isTomorrow(dueDate)) {
      return `Tomorrow, ${format(dueDate, "HH:mm")} IST`;
    }
    return `${format(dueDate, "yyyy-MM-dd HH:mm")} IST`;
  };

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
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="text-sm">{task.description}</p>
                )}
                <p className="text-sm">Due: {formatDueDate(task.dueDate)}</p>
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
                        className="bg-red-800"
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

export default InboxPage;
