"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

/* UI and modals */
import AppSidebar from "@/app/components/AppSidebar";
import TaskModal from "@/app/components/TaskModal";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/app/components/ThemeToggle";

/* Data helpers */
import { createTask, updateTask, Task } from "@/lib/methods/tasks";
import {
  createProject,
  deleteProjects,
  getProjects,
} from "@/lib/methods/projects";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import GlobalSearch from "./Globalsearch";
import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";
import Notificationdropdown from "./Notificationdropdown";

/* Root provider --------------------------------------------------------- */
export default function ClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <NextTopLoader color="#50C878" />
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/* Layout with sidebar & modals ----------------------------------------- */
export function LayoutWithSidebar({ children }: { children: ReactNode }) {
  /* --------------------------------- refs -------------------------------- */
  const searchRef = useRef<{ open: () => void }>(null);

  /* ------------------------------- projects ------------------------------ */
  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  /* ------------------------------- modals -------------------------------- */
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  /* ------------------------ query-string modal triggers ------------------ */
  const searchParams = useSearchParams();

  useEffect(() => {
    const modal = searchParams.get("modal");
    if (modal === "add-task") {
      setEditingTask(null);
      setIsTaskModalOpen(true);
    } else if (modal === "add-project") {
      setIsProjectModalOpen(true);
    }
  }, [searchParams]);

  /* ------------------------ clean URL after open ------------------------- */
  useEffect(() => {
    if (isTaskModalOpen || isProjectModalOpen) {
      const url = new URL(window.location.href);
      url.searchParams.delete("modal");
      window.history.replaceState(null, "", url.toString());
    }
  }, [isTaskModalOpen, isProjectModalOpen]);

  /* --------------------------- event handlers ---------------------------- */
  const handleTaskSubmit = async ({
    title,
    description,
    dueDate,
    projectId,
  }: {
    title: string;
    description?: string;
    dueDate?: string;
    projectId?: string;
  }) => {
    if (editingTask) {
      await updateTask(
        editingTask.id as number,
        title,
        description,
        dueDate,
        projectId,
        editingTask.completed
      );
      toast.success("Task updated!");
    } else {
      await createTask(title, description, dueDate, projectId);
      toast.success("Task created!");
    }
    setIsTaskModalOpen(false);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error("Project name required");
      return;
    }
    const id = crypto.randomUUID();
    await createProject(id, newProjectName.trim());
    setNewProjectName("");
    setIsProjectModalOpen(false);
    refetchProjects();
    toast.success("Project added!");
  };
  const router = useRouter();
  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteProjects(id);
    refetchProjects();
    toast.success("Project deleted");
    router.push("/inbox?_=" + Date.now(), { scroll: true });
  };

  /* ----------------------------- layout JSX ------------------------------ */
  return (
    <div className="flex w-full h-screen">
      {/* Global search dialog (controlled via ref) */}
      <GlobalSearch ref={searchRef} />

      {/* Sidebar */}
      <AppSidebar
        projects={projects}
        onAddProject={() => setIsProjectModalOpen(true)}
        onAddTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onSearch={() => searchRef.current?.open()}
        onDeleteProject={handleDeleteProject}
      />

      {/* Theme toggle (top-right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Notificationdropdown />
        <ThemeToggle />
      </div>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>

      {/* Shared modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        editingTask={editingTask}
        onSubmit={handleTaskSubmit}
        projects={projects}
      />

      <Dialog
        open={!!projectToDelete}
        onOpenChange={() => setProjectToDelete(null)}
      >
        <DialogContent>
          <DialogTitle>Delete project?</DialogTitle>
          <p>This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteProjects(projectToDelete!);
                refetchProjects();
                toast.success("Project deleted");
                setProjectToDelete(null);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Add a Project</DialogTitle>
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <Input
              autoFocus
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Add Project
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

