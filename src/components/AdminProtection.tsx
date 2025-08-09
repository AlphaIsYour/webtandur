import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "next-auth/react";

interface AdminProtectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminProtection = ({
  children,
  fallback,
}: AdminProtectionProps) => {
  const { user, loading, isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // User not logged in, redirect to login
        signIn(undefined, {
          callbackUrl: window.location.pathname,
        });
      } else if (user && !isAdmin) {
        // User logged in but not admin, redirect to appropriate dashboard
        if (user.role === "petani") {
          router.push("/petani/dashboard");
        } else if (user.role === "pembeli") {
          router.push("/pembeli/dashboard");
        } else {
          router.push("/");
        }
      }
    }
  }, [user, loading, isAdmin, isAuthenticated, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show fallback if user is not authenticated or not admin
  if (!isAuthenticated || !user || !isAdmin) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};
