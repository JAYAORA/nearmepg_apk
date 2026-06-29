"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/data/auth-context";
import PropertyForm from "../PropertyForm";
import { adminCreateProperty } from "@/lib/admin-api";
import type { PropertyPayload } from "@/lib/admin-api";

export default function NewPropertyPage() {
  const { user } = useAuth();

  const handleCreate = async (payload: PropertyPayload) => {
    await adminCreateProperty(payload);
  };

  return (
    <main className="md:max-w-10/12 md:mx-auto w-full px-5 sm:px-6 py-8 pb-20">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to My Properties
        </Link>
        <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
          Add New Property
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Fill in the details to list your property on NearMePG.
        </p>
      </div>

      <PropertyForm
        ownerEmail={user?.email ?? ""}
        onSubmit={handleCreate}
      />
    </main>
  );
}
