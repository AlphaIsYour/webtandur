// src/components/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
