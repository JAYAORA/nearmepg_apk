"use client";

import { useAuth } from "@/data/auth-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type UnverifiedGuardProps = {
  verified: boolean;
  ownerEmail: string;
  ownerName?: string;
  ownerContact?: string;
  children: React.ReactNode;
};

export default function UnverifiedGuard({
  verified,
  ownerEmail,
  ownerName,
  ownerContact,
  children,
}: UnverifiedGuardProps) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  // If verified, show content normally
  if (verified) return <>{children}</>;

  // If not verified, we need to know the auth state
  if (!isAuthReady) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  let isOwner = false;

  if (ownerEmail) {
    isOwner = user?.email === ownerEmail;
  } else if (ownerName && ownerContact) {
    // Fallback if no email is available for the property
    // isOwner = user?.name === ownerName && user?.phone === ownerContact;
    isOwner = user?.name === ownerName;
  }

  console.log({ ownerName, ownerContact, ownerEmail, user });

  // If not owner and not admin, block access completely
  if (!isOwner && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">
          Access Restricted
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          This property is currently pending verification and is not available
          for public viewing.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // If allowed to view but unverified, show warning banner and content
  return (
    <>
      <div className="bg-amber-100 text-amber-800 p-3 text-center text-sm font-semibold">
        Warning: This property is currently unverified and hidden from the
        public.
      </div>
      {children}
    </>
  );
}
