"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/data/auth-context";
import PropertyForm from "../../PropertyForm";
import { adminGetProperty, adminUpdateProperty } from "@/lib/admin-api";
import type { PropertyPayload } from "@/lib/admin-api";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [initialData, setInitialData] = useState<Partial<PropertyPayload> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing property data to pre-fill form
  useEffect(() => {
    if (!id) return;

    adminGetProperty(id)
      .then((data) => {
        // Map API response to form state shape
        // The new API stores fields using the new schema names directly
        setInitialData({
          name:          data.name,
          slug:          data.slug,
          description:   data.description,
          propertyType:  data.propertyType ?? "pg",
          gender:        data.gender,
          price:         data.price ?? data.starting_price,
          pricingUnit:   data.pricingUnit ?? "month",
          rating:        data.rating,
          reviewCount:   data.reviewCount ?? data.reviews ?? 0,
          verified:      data.verified ?? false,
          city:          data.city,
          area:          data.area ?? data.location?.split(",")?.[0]?.trim() ?? "",
          location:      data.location,
          googleMapsLink: data.googleMapsLink ?? data.google_maps_link,
          thumbnail:     data.thumbnail ?? data.images?.[0] ?? "",
          images:        data.images ?? [],
          amenities:     data.amenities ?? [],
          owner_mail:    data.owner_mail,
          owner_contact: data.owner_contact,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (payload: PropertyPayload) => {
    await adminUpdateProperty(id, payload);
  };

  // ── States ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="md:max-w-10/12 md:mx-auto px-5 py-16 text-center">
        <div className="flex items-center justify-center gap-2 text-rose-600 mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg font-semibold">{error ?? "Property not found"}</span>
        </div>
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-400 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Properties
        </Link>
      </div>
    );
  }

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
          Edit Property
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Update the details for{" "}
          <span className="font-medium text-slate-700">{initialData.name}</span>.
        </p>
      </div>

      <PropertyForm
        propertyId={id}
        initialData={initialData}
        ownerEmail={user?.email ?? initialData.owner_mail ?? ""}
        onSubmit={handleUpdate}
      />
    </main>
  );
}
