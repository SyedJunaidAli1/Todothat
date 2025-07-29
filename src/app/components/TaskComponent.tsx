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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteTask, Task, updateTask } from "@/lib/methods/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TaskComponent = ({
  task,
  openEditTaskModal,
}: {
  task: Task;
  openEditTaskModal: (task: Task) => void;
}) => {
  const queryClient = useQueryClient();
  const [isOverdue, setIsOverdue] = useState(() => {
  
    const dueDate = task.dueDate;
    const currentTime = new Date();
    if (!dueDate) return false;
    return dueDate < currentTime;
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const dueDate = task.dueDate;
      const currentTime = new Date();
      if (!dueDate) return;
      setIsOverdue(dueDate < currentTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [task.dueDate]);

  // Format (shortened for simplicity)
  const formatDueTime = (dueDate: Date | null) => {
    if (!dueDate) return "No due time";
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const zonedDate = toZonedTime(dueDate, userTimezone);
      return format(zonedDate, "HH:mm") + " (" + userTimezone + ")";
    } catch (e) {
      return format(dueDate, "HH:mm") + " (UTC)";
    }
  };

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "Today"] });
      toast.success("Task deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete task");
    },
  });

  const completeMutation = useMutation({
    mutationFn: (params: {
      taskId: number;
      title: string;
      description: string;
      dueDate: Date | undefined;
      project: string;
      completed: boolean;
    }) =>
      updateTask(
        params.taskId,
        params.title,
        params.description,
        params.dueDate,
        params.project,
        params.completed
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "Today"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "Completed"] });
      toast.success("Task marked as completed!");
    },
    onError: (err: any) => {
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
        project: task.project,
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
              {isOverdue && (
                <span className="text-red-500 ml-2">(Overdue)</span>
              )}
            </p>
            <p className="text-sm">Project: {task.project}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditTaskModal(task)}
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

export default TaskComponent;
