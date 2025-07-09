import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: Date;
  project: string;
  completed: boolean;
}

interface TaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask: Task | null;
  onSubmit: (task: {
    title: string;
    description: string;
    dueDate?: Date;
    project: string;
  }) => Promise<void>;
}

export default function TaskModal({
  isOpen,
  onOpenChange,
  editingTask,
  onSubmit,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [project, setProject] = useState("Inbox");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setProject(editingTask.project);
      if (editingTask.dueDate) {
        const due = new Date(editingTask.dueDate);
        setDueDate(due.toISOString().split("T")[0]);
        setDueTime(
          `${due.getHours().toString().padStart(2, "0")}:${due.getMinutes().toString().padStart(2, "0")}`
        );
      } else {
        setDueDate("");
        setDueTime("");
      }
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("");
      setProject("Inbox");
      setError("");
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      let dueDateValue: Date | undefined;
      if (dueDate) {
        dueDateValue = new Date(dueDate);
        if (dueTime) {
          const [hours, minutes] = dueTime.split(":").map(Number);
          dueDateValue.setHours(hours, minutes);
        }
      }

      await onSubmit({ title, description, dueDate: dueDateValue, project });

      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to save task");
      toast.error(err.message || "Failed to save task");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span className="hidden" aria-label="Add or Edit Task">
          Add or Edit Task
        </span>
      </DialogTrigger>
      <DialogContent
        className={`border-2 w-full max-w-md rounded-lg shadow-lg p-2 transition-all duration-200 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <DialogTitle className="text-xl text-center text-emerald-500 font-bold px-6 py-1">
          {editingTask ? "Edit Task" : "Add a Task"}
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full"
            aria-label="Task title"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full"
            aria-label="Task description"
          />
          <div className="flex gap-2">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-1/2"
              aria-label="Due date"
            />
            <Input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-1/2"
              aria-label="Due time"
            />
          </div>
          <Input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Project (e.g., Inbox)"
            className="w-full"
            aria-label="Project name"
          />
          {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {editingTask ? "Update Task" : "Add Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}