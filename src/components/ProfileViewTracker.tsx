"use client";
import { useEffect } from "react";

interface ProfileViewTrackerProps {
  petaniId: string;
}

export default function ProfileViewTracker({
  petaniId,
}: ProfileViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/profile-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ petaniId }),
        });
      } catch (error) {
        console.error("Failed to track profile view:", error);
      }
    };

    trackView();
  }, [petaniId]);

  return null; // This component doesn't render anything
}
