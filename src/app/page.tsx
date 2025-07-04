"use client";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { Sidebar, SidebarItem } from "./components/Sidebar";
import {
  CalendarDays,
  CalendarFold,
  CirclePlus,
  ClipboardCheck,
  InboxIcon,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearchParams } from "next/navigation";
import { getAllTasks } from "@/lib/utils/search";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev); // Toggle search modal
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []); // Empty dependency array to run once on mount

  const handleItemSelect = (itemText: string) => {
    if (itemText === "Add Task") {
      setEditingTask(null); // Clear editing state for new task
      setIsModalOpen(true);
    } else if (itemText === "Search") {
      setActiveItem(itemText);
      setIsSearchOpen(true); // Open search modal
    } else {
      setActiveItem(itemText);
      setIsSearchOpen(false); // Close search modal when switching
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
        await updateTask(
          editingTask.id as number, // Cast to number since Task.id is number
          title,
          description,
          dueDateValue,
          project,
          editingTask.completed
        );
        toast.success("Task updated successfully!");
      } else {
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
      queryClient.invalidateQueries({ queryKey: ["tasks", project] });
    } catch (err: any) {
      setError(err.message || "Failed to save task");
      toast.error(err.message || "Failed to save task");
    }
  };

  const handleSearchSelect = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    window.history.pushState({}, "", `/?${params.toString()}`);
    // Only close if a specific item is selected (handled by CommandItem onSelect)
  };

  const handleCommandSelect = (value: string) => {
    handleSearchSelect(value);
    if (value === "add-task") {
      setIsModalOpen(true); // Open Add Task modal
    } else if (["inbox", "today", "upcoming", "completed"].includes(value)) {
      setActiveItem(value.charAt(0).toUpperCase() + value.slice(1)); // Navigate to section
    }
    setIsSearchOpen(false); // Close search modal
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Inbox":
        return (
          <InboxPage
            searchTerm={searchTerm}
            onAddTask={() => handleItemSelect("Add Task")}
            onEditTask={handleEditTask}
          />
        );
      case "Today":
        return (
          <TodayPage
            searchTerm={searchTerm}
            onAddTask={() => handleItemSelect("Add Task")}
            onEditTask={handleEditTask}
          />
        );
      case "Upcoming":
        return (
          <UpcomingPage
            searchTerm={searchTerm}
            onAddTask={() => handleItemSelect("Add Task")}
            onEditTask={handleEditTask}
          />
        );
      case "Completed":
        return (
          <CompletedPage searchTerm={searchTerm} onEditTask={handleEditTask} />
        );
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
          icon={<InboxIcon />}
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full"
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-1/2"
              />
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-1/2"
              />
            </div>
            <Input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="Project (e.g., Inbox)"
              className="w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogTrigger asChild>
          <span className="hidden"></span>
        </DialogTrigger>
        <DialogContent className="border-2 w-full max-w-md rounded-lg shadow-lg p-2">
          <DialogTitle className="text-xl text-center text-emerald-500 font-bold px-6 py-1">
            Search Tasks
          </DialogTitle>
          <Command className="w-full">
            <CommandInput
              placeholder="Type a command or search..."
              value={searchTerm}
              onValueChange={handleSearchSelect}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => handleCommandSelect("inbox")}>
                  <InboxIcon />
                  <span>Go to Inbox</span>
                </CommandItem>
                <CommandItem onSelect={() => handleCommandSelect("today")}>
                  <CalendarFold />
                  <span>Go to Today</span>
                </CommandItem>
                <CommandItem onSelect={() => handleCommandSelect("upcoming")}>
                  <CalendarDays />
                  <span>Go to Upcoming</span>
                </CommandItem>
                <CommandItem onSelect={() => handleCommandSelect("completed")}>
                  <ClipboardCheck />
                  <span>Go to Completed</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem onSelect={() => handleCommandSelect("add-task")}>
                  <CirclePlus />
                  <span>Add Task</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Tasks">
                {getAllTasks(queryClient, project)
                  .filter((task) =>
                    task.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((task) => (
                    <CommandItem
                      key={task.id}
                      onSelect={() => {
                        handleSearchSelect(task.title);
                        setActiveItem(task.section);
                      }}
                    >
                      {task.section === "Inbox" && <InboxIcon />}
                      {task.section === "Today" && <CalendarFold />}
                      {task.section === "Upcoming" && <CalendarDays />}
                      {task.section === "Completed" && <ClipboardCheck />}
                      <span>{task.title}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
