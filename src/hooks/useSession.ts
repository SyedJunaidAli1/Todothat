// hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session/");
        const data = await res.json();
        setSession(data.session);
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { session, loading };
}
