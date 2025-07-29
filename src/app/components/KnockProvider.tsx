"use client";
import { authClient } from "@/lib/auth-client";
import { KnockFeedProvider } from "@knocklabs/react-notification-feed";
export function KnockProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  if (!session?.user) return null;

  return (
    <KnockFeedProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!}
      feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_ID!}
      userId={session.user.id}
    >
      {children}
    </KnockFeedProvider>
  );
}