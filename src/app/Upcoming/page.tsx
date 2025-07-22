"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, Task, updateTask, deleteTask } from "@/lib/methods/tasks";
import { format, toZonedTime } from "date-fns-tz"; // Switch to date-fns-tz
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const Page = ({ onAddTask, onEditTask }: UpcomingPageProps) => {
  const queryClient = useQueryClient();

  // Fetch tasks with future due dates (excluding completed)
  const today = new Date(); // July 04, 2025, 03:38 PM IST
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks", "Upcoming"],
    queryFn: () => getTasks(undefined, undefined, today, false),
  });

  // Default content when there are no tasks
  const defaultContent = (
    <div className="flex flex-col gap-2 px-6 mt-18">
      <h2 className="text-2xl">Upcoming</h2>
      <h3>No upcoming tasks</h3>
      <p>Add a task with a future due date to get started!</p>
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

  // If there are no tasks, show the default content
  if (tasks.length === 0) {
    return defaultContent;
  }

  // If there are tasks, display them in a list
  return (
    <div className="flex flex-col gap-4 px-6 mt-18">
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
          <TaskComponent task={task} onEditTask={onEditTask} key={task.id} />
        ))}
      </ul>
    </div>
  );
};

export default Page;

const TaskComponent = ({
  task,
  onEditTask,
}: {
  task: Task;
  onEditTask: (task: Task) => void;
}) => {
  const [isOverdue, setIsOverdue] = useState(() => {
    const dueDate = task.dueDate;
    const currentTime = new Date();
    if (!dueDate) return false;
    return dueDate < currentTime;
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      const dueDate = task.dueDate;
      const currentTime = new Date();
      if (!dueDate) return;
      setIsOverdue(dueDate < currentTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [task.dueDate]);

  // Format due time and date with user's local timezone, including day
  const formatDueTime = (dueDate: Date | null) => {
    if (!dueDate) return "No due time";
    try {
      // Convert UTC to user's local timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const zonedDate = toZonedTime(dueDate, userTimezone);
      // Format with day, month, year, and time (e.g., "dd MMM yyyy HH:mm")
      return format(zonedDate, "dd MMM yyyy HH:mm") + " (" + userTimezone + ")";
    } catch (e) {
      console.error("Timezone conversion error:", e);
      return format(dueDate, "dd MMM yyyy HH:mm") + " (UTC)"; // Fallback to UTC
    }
  };

  // Mutation for deleting a task
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "Upcoming"] });
      toast.success("Task deleted successfully!");
    },
    onError: (err: any) => {
      console.error("Mutation error:", err);
      toast.error(err.message || "Failed to delete task");
    },
  });

  // Mutation for completing a task
  const completeMutation = useMutation({
    mutationFn: (params: { taskId: number; title: string; description: string; dueDate: Date | undefined; project: string; completed: boolean }) =>
      updateTask(params.taskId, params.title, params.description, params.dueDate, params.project, params.completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "Today"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "Inbox"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "Upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "Completed"] });
      toast.success("Task marked as completed!");
    },
    onError: (err: any) => {
      console.error("Mutation error:", err);
      toast.error(err.message || "Failed to complete task");
    },
  });

  const [isCompleted, setIsCompleted] = useState(false);

  const handleCompleteChange = (checked: boolean) => {
    setIsCompleted(checked);
    if (checked) {
      const audio = new Audio("/simply-notify.mp3");
      audio.play().catch((err) => console.error("Audio play failed:", err));
      completeMutation.mutate({
        taskId: task.id,
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate,
        project: task.projects,
        completed: true,
      });
    }
  };

  return (
    <li
      key={task.id}
      className={`p-4 border rounded-lg shadow-sm ${
        isOverdue ? "border-red-500" : "border-emerald-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`complete-${task.id}`}
            checked={isCompleted}
            onCheckedChange={handleCompleteChange}
            disabled={completeMutation.isPending}
          />
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.description && <p className="text-sm">{task.description}</p>}
            <p className="text-sm">
              Due: {formatDueTime(task.dueDate)}
              {isOverdue && <span className="text-red-500 ml-2">(Overdue)</span>}
            </p>
            <p className="text-sm">Project: {task.projects.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEditTask(task)}>
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
                  This action cannot be undone. This will permanently delete the
                  task "{task.title}".
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
  );
};