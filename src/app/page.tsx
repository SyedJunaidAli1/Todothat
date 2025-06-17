"use client";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { Sidebar, SidebarItem } from "./components/Sidebar";
import {
  CalendarDays,
  CalendarFold,
  CirclePlus,
  ClipboardCheck,
  Inbox,
  Search,
  Folder,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import InboxPage from "./components/InboxPage";
import CompletedPage from "./components/CompletedPage";
import UpcomingPage from "./components/UpcomingPage";
import TodayPage from "./components/TodayPage";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask, updateTask, Task } from "@/lib/methods/tasks";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Home() {
  const [activeItem, setActiveItem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [project, setProject] = useState("Inbox");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setProject(editingTask.project);
      if (editingTask.dueDate) {
        const due = new Date(editingTask.dueDate);
        setDueDate(due.toISOString().split("T")[0]); // Format: YYYY-MM-DD
        setDueTime(
          `${due.getHours().toString().padStart(2, "0")}:${due.getMinutes().toString().padStart(2, "0")}`
        );
      } else {
        setDueDate("");
        setDueTime("");
      }
    }
  }, [editingTask]);

  const handleItemSelect = (itemText: string) => {
    if (itemText === "Add Task") {
      setEditingTask(null); // Clear editing state for new task
      setIsModalOpen(true);
    } else {
      setActiveItem(itemText);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, title, description, dueDateValue, project);
        toast.success("Task updated successfully!");
      } else {
        // Create new task
        await createTask(title, description, dueDateValue, project);
        toast.success("Task created successfully!");
      }

      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("");
      setProject("Inbox");
      setEditingTask(null);
      // Invalidate queries to refetch tasks
      queryClient.invalidateQueries({ queryKey: ["tasks", project] });
    } catch (err: any) {
      setError(err.message || "Failed to save task");
      toast.error(err.message || "Failed to save task");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setProject("Inbox");
    setError("");
    setEditingTask(null);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Inbox":
        return <InboxPage onAddTask={() => handleItemSelect("Add Task")} onEditTask={handleEditTask} />;
      case "Today":
        return <TodayPage onAddTask={() => handleItemSelect("Add Task")} onEditTask={handleEditTask} />;
      case "Upcoming":
        return <UpcomingPage />;
      case "Completed":
        return <CompletedPage />;
      default:
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">Welcome</h2>
            <p>Select an item to view its content.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full h-screen">
      <PagesTopLoader color="#50C878" />
      <Sidebar onItemSelect={handleItemSelect}>
        <SidebarItem
          icon={<CirclePlus />}
          text="Add Task"
          active={activeItem === "Add Task"}
        />
        <SidebarItem
          icon={<Search />}
          text="Search"
          active={activeItem === "Search"}
        />
        <SidebarItem
          icon={<Inbox />}
          text="Inbox"
          alert
          active={activeItem === "Inbox"}
        />
        <SidebarItem
          icon={<CalendarFold />}
          text="Today"
          active={activeItem === "Today"}
        />
        <SidebarItem
          icon={<CalendarDays />}
          text="Upcoming"
          active={activeItem === "Upcoming"}
        />
        <SidebarItem
          icon={<ClipboardCheck />}
          text="Completed"
          active={activeItem === "Completed"}
        />
        <SidebarItem
          icon={<Folder />}
          text="My Projects"
          active={activeItem === "My Projects"}
        >
          <SidebarItem
            icon={<Folder className="w-4 h-4" />}
            text="Project 1"
            active={activeItem === "Project 1"}
            onSelect={handleItemSelect}
          />
          <SidebarItem
            icon={<Folder className="w-4 h-4" />}
            text="Project 2"
            active={activeItem === "Project 2"}
            onSelect={handleItemSelect}
          />
          <SidebarItem
            icon={<Folder className="w-4 h-4" />}
            text="Project 3"
            active={activeItem === "Project 3"}
            onSelect={handleItemSelect}
          />
        </SidebarItem>
      </Sidebar>
      <div className="flex-1">
        <header className="p-4 flex justify-end">
          <ThemeToggle />
        </header>
        <main className="p-6">{renderContent()}</main>
      </div>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogTrigger asChild>
          <span className="hidden">Add Task</span>
        </DialogTrigger>
        <DialogContent
          className={`border-2 w-full max-w-md rounded-lg shadow-lg p-2 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <DialogTitle className="text-xl text-center text-emerald-500 font-bold px-6 py-1">
            {editingTask ? "Edit Task" : "Add a Task"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="px-4 py-2 space-y-3">
            <div>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your next task?"
                className="w-full p-2 border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 border rounded-md text-sm resize-none"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-auto text-sm rounded-md"
              />
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-auto text-sm rounded-md"
              />
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-auto p-1 text-sm border rounded-md"
              >
                <option value="Inbox">Inbox</option>
                <option value="Project 1">Project 1</option>
                <option value="Project 2">Project 2</option>
                <option value="Project 3">Project 3</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}