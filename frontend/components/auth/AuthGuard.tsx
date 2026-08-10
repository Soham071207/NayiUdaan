"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login and append a 'next' query parameter if desired
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // While checking auth status, show a loader to prevent a flash of unauthenticated content
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5FAF4]">
        <Loader2 className="w-10 h-10 text-[#5F8D4E] animate-spin" />
      </div>
    );
  }

  // If not authenticated, render nothing while the useEffect triggers the redirect
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected children
  return <>{children}</>;
}
