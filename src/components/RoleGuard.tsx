"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type UserRole } from "@/data/auth-context";

interface RoleGuardProps {
  /** Roles that are allowed to access this page */
  allowedRoles: UserRole[];
  /** Where to redirect if the user doesn't have the right role (default: "/") */
  redirectTo?: string;
  children: React.ReactNode;
}

/**
 * RoleGuard wraps a page and redirects unauthenticated / unauthorized users.
 * - Unauthenticated → /login?redirect=<current path>
 * - Wrong role     → redirectTo (default "/")
 */
export default function RoleGuard({
  allowedRoles,
  redirectTo = "/",
  children,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);

  // Wait for localStorage hydration (auth-context uses useEffect to hydrate)
  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!isAuthenticated || !user) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(redirectTo);
    }
  }, [authReady, isAuthenticated, user, router, allowedRoles, redirectTo]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Checking access…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null; // Redirect in progress
  }

  return <>{children}</>;
}
