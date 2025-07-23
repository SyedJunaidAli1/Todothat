"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  Task,
  deleteTask,
  updateTask,
  createTask,
} from "@/lib/methods/tasks";
import { format, toZonedTime } from "date-fns-tz";
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
import TaskModal from "../components/TaskModal"; // Make sure this is your modal

// ---- MAIN PAGE ----
const Page = () => {
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
        toast.success("Task updated!");
      } else {
        await createTask(
          title,
          description,
          dueDate ?? undefined,
          projectId || null
        );
        toast.success("Task created!");
      }
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["tasks", "Today"] });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
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
          className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
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

export default Page;

// ---- PRESENTATIONAL TASK (no add/edit props) ----
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
