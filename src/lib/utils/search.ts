import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/methods/tasks";

export interface TaskWithSection extends Task {
  section: "Inbox" | "Today" | "Upcoming" | "Completed";
}

export function getAllTasks(queryClient: ReturnType<typeof useQueryClient>, project: string): TaskWithSection[] {
  const allTasks = queryClient.getQueriesData<Task[]>(["tasks", project])[0]?.[1] || [];
  if (!allTasks.length) {
    console.warn("No tasks found for project:", project); // Enhanced debug
  } else {
    console.log("All Tasks:", allTasks); // Debug: Check if tasks are fetched
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return allTasks
    .map(task => {
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        if (taskDate.toDateString() === today.toDateString() && !task.completed) return { ...task, section: "Today" };
        if (taskDate > today && !task.completed) return { ...task, section: "Upcoming" };
        if (task.completed) return { ...task, section: "Completed" };
      } else if (!task.completed) {
        return { ...task, section: "Inbox" }; // Tasks without due date go to Inbox
      }
      return null;
    })
    .filter((task): task is TaskWithSection => task !== null);
}