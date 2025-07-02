// src/components/AuthSync.tsx
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function AuthSync() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const sync = async () => {
      try {
        await fetch("/api/user/sync", { method: "POST" });
      } catch (err) {
        console.error("Failed to sync user:", err);
      }
    };

    if (isSignedIn && user?.id) {
      sync();
    }
  }, [isSignedIn, user?.id]);

  return null;
}
