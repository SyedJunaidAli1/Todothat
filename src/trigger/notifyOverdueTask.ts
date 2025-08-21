import { schedules, logger } from "@trigger.dev/sdk/v3";

export const notifyOverdueTask = schedules.task({
  id: "notify-overdue-every-5-mins",
  cron: "*/5 * * * *", // every 5 minutes
  run: async (_payload, { ctx }) => {
    try {
      const res = await fetch("https://www.todothat.space/api/notify-overdue-tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
