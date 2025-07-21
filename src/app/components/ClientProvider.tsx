// "use client"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactNode, useState } from "react";
// import { ThemeProvider } from "@/components/ui/theme-provider";
// import { Toaster } from "@/components/ui/sonner";
// import NextTopLoader from "nextjs-toploader";

// export default function ClientProvider({ children }: { children: ReactNode }) {
//   const [client] = useState(() => new QueryClient());

//   return (
//     <QueryClientProvider client={client}>
//       <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
//         <main>
//           <NextTopLoader color="#50C878" />
//           {children}
//         </main>
//         <Toaster richColors />
//       </ThemeProvider>
//     </QueryClientProvider>
//   );
// }

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

/* sidebar + modals */
import AppSidebar from "@/app/components/AppSidebar";
import TaskModal from "@/app/components/TaskModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

/* data */
import { createTask, updateTask, Task } from "@/lib/methods/tasks";
import {
  createProject,
  deleteProjects,
  getProjects,
} from "@/lib/methods/projects";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function ClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <NextTopLoader color="#50C878" />
        <LayoutWithSidebar>{children}</LayoutWithSidebar>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/* ---------- child that uses useQuery ---------- */
function LayoutWithSidebar({ children }: { children: ReactNode }) {
  /* projects */
  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  /* task modal */
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  /* project modal */
  const [newProjectName, setNewProjectName] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  /* --- handlers --- */
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

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteProjects(id);
    refetchProjects();
    toast.success("Project deleted");
  };

  return (
    <div className="flex w-full h-screen">
      <AppSidebar
        projects={projects}
        onAddProject={() => setIsProjectModalOpen(true)}
        onAddTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onSearch={() => {
          /* open global search dialog later */
        }}
        onDeleteProject={handleDeleteProject}
      />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>

      {/* shared modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        editingTask={editingTask}
        onSubmit={handleTaskSubmit}
        projects={projects}
      />

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
