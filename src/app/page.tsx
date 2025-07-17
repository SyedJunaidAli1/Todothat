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
  Trash,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import InboxPage from "./components/InboxPage";
import CompletedPage from "./components/CompletedPage";
import UpcomingPage from "./components/UpcomingPage";
import TodayPage from "./components/TodayPage";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask, Task, getTasks } from "@/lib/methods/tasks";
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
import TaskModal from "./components/TaskModal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createProject,
  deleteProjects,
  getProjects,
} from "@/lib/methods/projects";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
}

export default function Home() {
  const [activeItem, setActiveItem] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    if (isTaskModalOpen || isProjectModalOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isTaskModalOpen, isProjectModalOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleItemSelect = (itemText: string) => {
    if (itemText === "Add Task") {
      setEditingTask(null);
      setIsTaskModalOpen(true);
    } else if (itemText === "Search") {
      setActiveItem(itemText);
      setIsSearchOpen(true);
    } else if (itemText === "Add Project") {
      setIsProjectModalOpen(true);
    } else {
      setActiveItem(itemText);
      setIsSearchOpen(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      const id = crypto.randomUUID();
      const newProject = await createProject(id, newProjectName.trim());
      setProjects((prev) => [...prev, newProject]);
      setNewProjectName("");
      setIsProjectModalOpen(false);
      toast.success("Project added successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleSearchSelect = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    window.history.pushState({}, "", `/?${params.toString()}`);
  };

  const handleCommandSelect = (value: string) => {
    handleSearchSelect(value);
    if (value === "add-task") {
      setIsTaskModalOpen(true);
    } else if (value === "add-project") {
      setIsProjectModalOpen(true);
    } else if (["inbox", "today", "upcoming", "completed"].includes(value)) {
      setActiveItem(value.charAt(0).toUpperCase() + value.slice(1));
    }
    setIsSearchOpen(false);
  };

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    try {
      await deleteProjects(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      toast.success("Project deleted successfully");
      if (
        activeItem &&
        projects.find((p) => p.id === id)?.name === activeItem
      ) {
        setActiveItem("Inbox");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    }
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
          <CompletedPage
            searchTerm={searchTerm}
            onAddTask={() => handleItemSelect("Add Task")}
            onEditTask={handleEditTask}
          />
        );
      default:
        if (projects.some((p) => p.name === activeItem)) {
          return (
            <div className="p-4">
              <h2 className="text-2xl font-bold">{activeItem}</h2>
              <p>Tasks for {activeItem} will be displayed here.</p>
            </div>
          );
        }
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">Welcome</h2>
            <p>Select an item to view its content.</p>
          </div>
        );
    }
  };

  const [searchTasks, setSearchTasks] = useState<Task[]>([]);
  useEffect(() => {
    const fetchSearchTasks = async () => {
      if (isSearchOpen) {
        const inboxTasks = await queryClient.fetchQuery({
          queryKey: ["tasks", "Inbox"],
          queryFn: () => getTasks(undefined, undefined, undefined, false),
        });

        const filtered = (inboxTasks || []).filter((task) => {
          const searchMatch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ??
              false) ||
            task.project.toLowerCase().includes(searchTerm.toLowerCase());
          return searchMatch;
        });
        setSearchTasks(filtered);
      }
    };
    fetchSearchTasks();
  }, [isSearchOpen, searchTerm, queryClient]);

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
          prefixIcon={
            <CirclePlus
              className="w-4 h-4 cursor-pointer"
              onClick={() => handleItemSelect("Add Project")}
            />
          }
        >
          {projects.map((project) => (
            <SidebarItem
              key={project.id}
              icon={<Folder className="w-4 h-4" />}
              text={
                <div className="flex justify-between items-center w-full">
                  <Link
                    href={`/Projects/${project.id}`}
                    className="flex-1 truncate cursor-pointer hover:underline"
                    onClick={() => handleItemSelect(project.name)}
                  >
                    {project.name}
                  </Link>
                  <Trash
                    className="w-4 h-4 ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={(e) => handleDeleteProject(e, project.id)}
                  />
                </div>
              }
              active={activeItem === project.name}
            />
          ))}
        </SidebarItem>
      </Sidebar>
      <div className="flex-1">
        <header className="p-4 flex justify-end">
          <ThemeToggle />
        </header>
        <main className="p-6">{renderContent()}</main>
      </div>
      <TaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        editingTask={editingTask}
        onSubmit={async ({ title, description, dueDate, projectId }) => {
          if (editingTask) {
            await updateTask(
              editingTask.id as number,
              title,
              description,
              dueDate,
              projectId,
              editingTask.completed
            );
            toast.success("Task updated successfully!");
          } else {
            await createTask(title, description, dueDate, projectId);

            toast.success("Task created successfully!");
          }
          queryClient.invalidateQueries({
            queryKey: ["tasks", projectId ?? "Inbox"],
          });
        }}
        projects={projects}
      />
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogTrigger asChild>
          <span className="hidden">Add Project</span>
        </DialogTrigger>
        <DialogContent
          className={`border-2 w-full max-w-md rounded-lg shadow-lg p-2 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <DialogTitle className="text-xl text-center text-emerald-500 font-bold px-6 py-1">
            Add a Project
          </DialogTitle>
          <form onSubmit={handleProjectSubmit} className="space-y-4 p-6">
            <Input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full"
            />
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Add Project
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
              placeholder="Type to search Inbox tasks..."
              value={searchTerm}
              onValueChange={handleSearchSelect}
            />
            <CommandList>
              <CommandEmpty>No matching tasks found.</CommandEmpty>
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
                <CommandItem
                  onSelect={() => handleCommandSelect("add-project")}
                >
                  <Folder />
                  <span>Add Project</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Tasks">
                {searchTasks.map((task) => (
                  <CommandItem
                    key={task.id}
                    onSelect={() => {
                      handleSearchSelect(task.title);
                      setActiveItem("Inbox");
                    }}
                  >
                    <InboxIcon />
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
