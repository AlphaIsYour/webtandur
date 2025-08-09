import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  image?: string;
  bio?: string;
  lokasi?: string;
  linkWhatsapp?: string;
  role: "admin" | "petani" | "pembeli";
  proyekTani?: Array<{
    id: string;
    namaProyek: string;
    deskripsi: string;
    lokasiLahan: string;
  }>;
}

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    if (status === "authenticated" && session) {
      fetchUserData();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        const result = await response.json();
        setUser(result.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    router.push("/api/auth/signout");
  };

  return {
    user,
    loading: loading || status === "loading",
    logout,
    session,
    isAuthenticated: status === "authenticated",
    isAdmin: user?.role === "admin",
    isPetani: user?.role === "petani",
    isPembeli: user?.role === "pembeli",
  };
};
