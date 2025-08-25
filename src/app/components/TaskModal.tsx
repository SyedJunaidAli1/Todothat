"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: Date;
  projectId: string | null;
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
    projectId: string | null;
  }) => Promise<void>;
  projects: { id: string; name: string }[];
}

export default function TaskModal({
  isOpen,
  onOpenChange,
  editingTask,
  onSubmit,
  projects,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string>(""); // 1-12
  const [minute, setMinute] = useState<string>(""); // 00-59
  const [period, setPeriod] = useState<"AM" | "PM">("AM"); // AM/PM
  const [selectedProject, setSelectedProject] = useState<string>("inbox"); // Use string for Select value
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title ?? "");
      setDescription(editingTask.description ?? "");
      setSelectedProject(
        editingTask.projectId ? editingTask.projectId : "inbox"
      );
      if (editingTask.dueDate) {
        const d = new Date(editingTask.dueDate);
        setDate(d);
        let h = d.getHours();
        setPeriod(h >= 12 ? "PM" : "AM");
        h = h % 12 || 12; // Convert to 1-12
        setHour(h.toString());
        setMinute(d.getMinutes().toString().padStart(2, "0"));
      } else {
        setDate(undefined);
        setHour("");
        setMinute("");
        setPeriod("AM");
      }
      setError("");
    } else {
      setTitle("");
      setDescription("");
      setSelectedProject("inbox");
      setDate(undefined);
      setHour("");
      setMinute("");
      setPeriod("AM");
      setError("");
    }
  }, [editingTask]);

  const buildDueDate = (): Date | undefined => {
    if (!date) return undefined;
    const d = new Date(date);
    let h = hour ? parseInt(hour, 10) : 0;
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    const m = minute ? parseInt(minute, 10) : 0;
    d.setHours(h, m, 0, 0);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const clearDue = () => {
    setDate(undefined);
    setHour("");
    setMinute("");
    setPeriod("AM");
  };

  const hours = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `${i + 1}`),
    []
  );
  const minutes = useMemo(
    () => Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, "0")),
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    try {
      setSubmitting(true);
      const due = buildDueDate();
      const projectId = selectedProject === "inbox" ? null : selectedProject;
      await onSubmit({
        title: trimmedTitle,
        description: description ?? "",
        dueDate: due,
        projectId,
      });
      onOpenChange(false);
      toast.success(editingTask ? "Task updated!" : "Task created!");
    } catch (err: any) {
      const msg = err?.message || "Failed to save task";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
        className="border-2 w-full max-w-md sm:max-w-lg rounded-lg shadow-lg p-2  overflow-y-auto max-h-[90vh] sm:max-h-[80vh]"
        onInteractOutside={(event) => {
          try {
            const path = (event as any).composedPath?.() ?? [];
            const clickedInsidePopover = path.some((el: any) => {
              try {
                return (
                  el &&
                  typeof el === "object" &&
                  el.getAttribute &&
                  el.getAttribute("data-dialog-ignore-interactions") !== null
                );
              } catch {
                return false;
              }
            });
            if (clickedInsidePopover) {
              event.preventDefault();
              event.stopPropagation();
            }
          } catch (err) {
            // fallback: do nothing
          }
        }}
      >
        <DialogTitle className="text-xl text-center text-emerald-500 font-bold px-4 sm:px-6 py-1">
          {editingTask ? "Edit Task" : "Add a Task"}
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            aria-label="Task title"
            disabled={submitting}
            className="text-base"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            aria-label="Task description"
            disabled={submitting}
            className="text-base min-h-[80px] sm:min-h-[100px]"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Due date & time</label>
            <div className="flex flex-wrap sm:flex-nowrap gap-2 items-stretch">
              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      !date && "text-muted-foreground",
                      "text-base py-2 px-3"
                    )}
                    disabled={submitting}
                  >
                    <CalendarIcon className="h-5 w-5" />
                    {date ? format(date, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-auto"
                  align="start"
                  sideOffset={8}
                  data-dialog-ignore-interactions
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      console.log("Selected date:", selectedDate);
                      setDate(selectedDate);
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={hour}
                onValueChange={setHour}
                disabled={submitting || !date}
              >
                <SelectTrigger className="w-[80px] sm:w-[70px] text-base">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={minute}
                onValueChange={setMinute}
                disabled={submitting || !date}
              >
                <SelectTrigger className="w-[80px] sm:w-[70px] text-base">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={period}
                onValueChange={(val: "AM" | "PM") => setPeriod(val)}
                disabled={submitting || !date}
              >
                <SelectTrigger className="w-[90px] sm:w-[80px] text-base">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
              {(date || hour || minute || period !== "AM") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearDue}
                  disabled={submitting}
                  className="text-base py-2 px-3"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project</label>
            <Select
              value={selectedProject}
              onValueChange={(val) => setSelectedProject(val)}
              disabled={submitting}
            >
              <SelectTrigger className="text-base w-full">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbox">Inbox</SelectItem>
                {projects.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="text-red-500 text-sm" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-base py-3"
            disabled={submitting}
          >
            {submitting
              ? editingTask
                ? "Updating…"
                : "Adding…"
              : editingTask
                ? "Update Task"
                : "Add Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
