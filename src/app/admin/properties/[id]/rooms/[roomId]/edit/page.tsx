"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/data/auth-context";
import RoomForm from "../../RoomForm";
import { adminGetProperties, adminGetRoom, adminUpdatePropertyRoom } from "@/lib/admin-api";
import type { RoomPayload, PropertyPayload } from "@/lib/admin-api";

export default function EditRoomPage() {
  const { id, roomId } = useParams<{ id: string; roomId: string }>();
  const { user } = useAuth();

  const [property, setProperty] = useState<(PropertyPayload & { id: string }) | null>(null);
  const [initialData, setInitialData] = useState<(RoomPayload & { firestoreId: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authReady || !user?.email || !id || !roomId) return;

    Promise.all([
      adminGetProperties(user.email),
      adminGetRoom(roomId)
    ])
      .then(([props, roomData]) => {
        const prop = props.find((p) => p.id === id);
        if (!prop) {
          throw new Error("Property not found or you don't own it");
        }
        setProperty(prop);
        setInitialData(roomData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [authReady, user?.email, id, roomId]);

  const handleUpdate = async (payload: RoomPayload) => {
    return await adminUpdatePropertyRoom(roomId, payload);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !property || !initialData) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
        <p className="text-rose-700">{error || "Failed to load"}</p>
        <Link
          href={`/admin/properties/${id}/rooms`}
          className="mt-6 inline-block text-amber-600 font-semibold"
        >
          &larr; Back
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
          Edit Room
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Updating room in <span className="font-medium text-slate-700">{property.name}</span>.
        </p>
      </div>

      <RoomForm
        hostelSlug={property.slug}
        propertyId={id}
        propertyType={property.propertyType}
        roomFirestoreId={roomId}
        initialData={initialData}
        onSubmit={handleUpdate}
      />
    </main>
  );
}
