"use client";
import { useEffect, useState, useRef } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
  Spinner,
} from "@knocklabs/react";

import "@knocklabs/react/dist/index.css";
import { authClient } from "@/lib/auth-client"; // adjust path if needed
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const Notificationdropdown = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const notifButtonRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      // const session = await authClient.getSession();
      const { data: session } = await authClient.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };

    fetchUser();
  }, []);

  if (!userId)
    return (
      <div>
        <Spinner color="oklch(0.723 0.219 149.579)" />
      </div>
    );

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!}
      user={{ id: userId }}
    >
      <KnockFeedProvider
        colorMode="dark"
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_ID!}
      >
        <>
          <div>
            <Button
              className="min-w-10 min-h-10"
              ref={notifButtonRef}
              onClick={() => setIsVisible(!isVisible)}
            >
              <Bell />
            </Button>
            <NotificationFeedPopover
              buttonRef={notifButtonRef}
              isVisible={isVisible}
              onClose={() => setIsVisible(false)}
            />
          </div>
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

export default Notificationdropdown;
