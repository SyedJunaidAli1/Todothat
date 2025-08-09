import { logger, task } from "@trigger.dev/sdk/v3";

export const notifyOverdueTask = task({
  id: "notify-overdue-task",
  run: async (_payload: any, { ctx }) => {
    try {
      const res = await fetch("http://localhost:3000/api/notify-overdue-tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // You can pass any payload if needed
      });

      const data = await res.json();

      logger.log("Notification API called", { data });

      return {
        success: true,
        response: data,
      };
    } catch (error) {
      logger.error("Failed to call API", { error });
      throw error;
    }
  },
});
