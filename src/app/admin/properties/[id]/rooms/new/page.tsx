"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/data/auth-context";
import RoomForm from "../RoomForm";
import { adminGetProperties, adminCreateRoom } from "@/lib/admin-api";
import type { RoomPayload, PropertyPayload } from "@/lib/admin-api";

export default function NewRoomPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  
  const [property, setProperty] = useState<(PropertyPayload & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authReady || !user?.email || !id) return;

    adminGetProperties(user.email)
      .then((props) => {
        const prop = props.find((p) => p.id === id);
        if (!prop) {
          setError("Property not found or you don't own it");
          setLoading(false);
          return;
        }
        setProperty(prop);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [authReady, user?.email, id]);

  const handleCreate = async (payload: RoomPayload) => {
    return await adminCreateRoom(payload);
  };

  if (!authReady || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="md:max-w-10/12 md:mx-auto px-5 py-16 text-center">
        <div className="flex items-center justify-center gap-2 text-rose-600 mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg font-semibold">{error ?? "Property not found"}</span>
        </div>
        <Link
          href={`/admin/properties/${id}/rooms`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-400 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <main className="md:max-w-10/12 md:mx-auto w-full px-5 sm:px-6 py-8 pb-20">
      <div className="mb-8">
        <Link
          href={`/admin/properties/${id}/rooms`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Rooms
        </Link>
        <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
          Add New Room
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Add a new room to <span className="font-medium text-slate-700">{property.name}</span>.
        </p>
      </div>

      <RoomForm
        hostelSlug={property.slug}
        propertyId={id}
        propertyType={property.propertyType}
        onSubmit={handleCreate}
      />
    </main>
  );
}
