"use client";
import { useSession } from "next-auth/react";
import Footer from "./Footer";

export default function FooterWrapper() {
  const { data: session } = useSession();

  return <Footer user={session?.user} isLoggedIn={!!session} />;
}
