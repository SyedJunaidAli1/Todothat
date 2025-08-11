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
} from "@/components/ui/dropdown-menu"; // Adjust path to your Shadcn components
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { authClient } from "@/lib/auth-client"; // Adjust path
import { FeedItem } from "@knocklabs/client";

// Helper to sanitize HTML (implement or import your own)
const sanitizeHtml = (html: string) => html; // Placeholder; use DOMPurify in production

const NotificationDropdown = () => {
  const { theme } = useTheme(); // For dark/light mode
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await authClient.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    fetchUser();
  }, []);

  if (!userId) return <div>Loading...</div>; // Or your Spinner

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!}
      user={{ id: userId }}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_ID!}
        colorMode={theme as "light" | "dark" | undefined} // Sync with next-themes
      >
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {/* Unread badge */}
              <CustomUnreadBadge />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-0 bg-background border-border shadow-lg"
          >
            <CustomNotificationFeed onClose={() => setIsOpen(false)} />
          </DropdownMenuContent>
        </DropdownMenu>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

// Custom unread badge component
const CustomUnreadBadge = () => {
  const { useFeedStore } = useKnockFeed();
  const metadata = useFeedStore((state) => state.metadata);
  if (metadata?.unread_count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
      {metadata.unread_count}
    </span>
  );
};

// Custom feed implementation (simplified without avatars or animations)
const CustomNotificationFeed = ({ onClose }: { onClose: () => void }) => {
  const { useFeedStore, feedClient } = useKnockFeed();
  const items = useFeedStore((state) => state.items);
  const metadata = useFeedStore((state) => state.metadata);
  const loading = useFeedStore((state) => state.loading);

  // Explicitly fetch on mount to handle refreshes
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        await feedClient.fetch(); // Fetches the latest feed items
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };
    fetchFeed();
  }, [feedClient]); // Runs once on mount

  useEffect(() => {}, [items]);

  const handleMarkAllAsRead = () => feedClient.markAllAsRead();
  const handleMarkAsRead = (notification: FeedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    feedClient.markAsRead([notification]);
  };
  const handleDismiss = (notification: FeedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    feedClient.markAsArchived([notification]);
  };

  const getNotificationContent = (notification: FeedItem) => {
    const firstBlock = notification.blocks?.[0];
    if (!firstBlock) return "No content";
    return sanitizeHtml(
      firstBlock.rendered || firstBlock.content || "No content"
    );
  };

  if (loading) return <div className="p-4">Loading notifications...</div>; // Customize skeleton if needed

  if (!items || items.length === 0)
    return (
      <div className="p-4 text-center text-muted-foreground">
        No notifications yet.
      </div>
    );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">Notifications</h3>
        {metadata?.unread_count > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-border">
        {items.map((notification) => {
          const content = getNotificationContent(notification);
          const isUnread = !notification.read_at;

          return (
            <div
              key={notification.id}
              className={`p-4 hover:bg-accent transition ${isUnread ? "bg-accent/20" : "opacity-75"}`}
              onClick={() => {
                feedClient.markAsRead([notification]);
                onClose();
              }}
            >
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Notification</p>{" "}
                  {/* Customize sender name if needed */}
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.inserted_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {isUnread && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleMarkAsRead(notification, e)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDismiss(notification, e)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationDropdown;
