"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  KnockFeedProvider,
  KnockProvider,
  useKnockFeed,
} from "@knocklabs/react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { FeedItem } from "@knocklabs/client";

const FILTERS = ["All", "Unread", "Read"] as const;
type FilterType = (typeof FILTERS)[number];

const sanitizeHtml = (html: string) => html; // Replace with a sanitizer in production

const NotificationDropdown = () => {
  const { theme } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: session } = await authClient.getSession();
      if (session?.user?.id) setUserId(session.user.id);
    }
    fetchUser();
  }, []);

  if (!userId)
    return <div className="p-4 text-muted-foreground">Loading...</div>;

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!}
      user={{ id: userId }}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_ID!}
        colorMode={theme as "light" | "dark"}
      >
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              <UnreadBadge />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-96 p-0 bg-background border-border shadow-lg"
          >
            <CustomNotificationFeed />
          </DropdownMenuContent>
        </DropdownMenu>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

const UnreadBadge = () => {
  const { useFeedStore } = useKnockFeed();
  const metadata = useFeedStore((state) => state.metadata);
  if (!metadata?.unread_count) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-flame-500 text-xs px-2 py-0.5 rounded-full">
      {metadata.unread_count}
    </span>
  );
};

const CustomNotificationFeed = () => {
  const { useFeedStore, feedClient } = useKnockFeed();
  const items = useFeedStore((state) => state.items);
  const loading = useFeedStore((state) => state.loading);

  const [filter, setFilter] = useState<FilterType>("All");

  useEffect(() => {
    feedClient.fetch(); // Ensures notifications persist after refresh
  }, [feedClient]);

  const handleMarkAllAsRead = () => feedClient.markAllAsRead();
  const handleMarkAsRead = (notification: FeedItem) =>
    feedClient.markAsRead([notification]);
  const handleDismiss = (notification: FeedItem) =>
    feedClient.markAsArchived([notification]);

  if (loading) return <div className="p-4">Loading notifications...</div>;
  if (!items || items.length === 0)
    return (
      <div className="p-8 text-center text-muted-foreground">
        No notifications yet.
      </div>
    );

  let filteredItems = items;
  if (filter === "Unread")
    filteredItems = items.filter((item) => !item.read_at);
  else if (filter === "Read")
    filteredItems = items.filter((item) => item.read_at);

  const renderNotification = (notification: FeedItem, isUnread: boolean) => {
    const firstBlock = notification.blocks?.[0];
    let content = "No content";
    if (firstBlock) {
      if ("rendered" in firstBlock && typeof firstBlock.rendered === "string")
        content = firstBlock.rendered;
      else if (
        "content" in firstBlock &&
        typeof firstBlock.content === "string"
      )
        content = firstBlock.content;
    }
    return (
      <div
        key={notification.id}
        className={`p-4 transition ${isUnread ? "bg-accent/20" : "bg-background opacity-70"} hover:bg-accent/40`}
      >
        <div className="flex justify-between items-center">
          <p className="font-medium">Task Overdue</p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.inserted_at), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div
          className="mt-1 text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
        <div className="flex gap-2 mt-2">
          {isUnread && (
            <button
              className="text-xs underline"
              type="button"
              onClick={() => handleMarkAsRead(notification)}
            >
              Mark as read
            </button>
          )}
          <button
            className="text-xs underline text-muted-foreground"
            type="button"
            onClick={() => handleDismiss(notification)}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header row with filter tabs and mark all as read */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex gap-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`font-semibold text-sm ${
                filter === f
                  ? "text-flame-500 border-b-2 border-flame-500 pb-1"
                  : "text-muted-foreground"
              }`}
              style={{ background: "none", border: "none" }}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          className="text-xs underline text-flame-500"
          type="button"
          onClick={handleMarkAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      {/* Notifications list */}
      <div>
        {filteredItems.length > 0 ? (
          filteredItems.map((noti) => renderNotification(noti, !noti.read_at))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No {filter.toLowerCase()} notifications.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
