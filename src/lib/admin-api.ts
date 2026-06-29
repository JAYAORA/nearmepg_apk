/**
 * Admin-side API helpers — calls the new /api/properties endpoints.
 * All functions are client-safe (no server-only imports).
 */

import type { Property, PropertyCardProps } from "@/types/property";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Types ────────────────────────────────────────────────────────────────────

/** Shape sent to POST /api/properties or PUT /api/properties/:id */
export interface PropertyPayload {
  name: string;
  slug: string;
  description: string;
  city: string;
  area: string;
  location: string;
  googleMapsLink?: string;
  google_maps_link?: string; // legacy support
  starting_price?: number; // legacy support
  reviews?: number; // legacy support
  propertyType: "pg" | "hotel" | "coliving";
  gender?: "men" | "women" | "coed";
  price: number;
  pricingUnit: "month" | "night";
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  thumbnail: string;
  images: string[];
  amenities: string[];
  owner_mail: string;
  owner_contact?: number;
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

/** List all properties owned by a given email. Pass empty string to get ALL properties (admin). */
export async function adminGetProperties(email: string): Promise<(PropertyPayload & { id: string })[]> {
  const url = email
    ? `${API_URL}/api/properties?email=${encodeURIComponent(email)}`
    : `${API_URL}/api/properties?all=true`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

/** Fetch a single property by id or slug (full data for pre-filling edit form). */
export async function adminGetProperty(idOrSlug: string): Promise<PropertyPayload & { id?: string }> {
  const res = await fetch(`${API_URL}/api/properties/${idOrSlug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Property not found");
  return res.json();
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/** Create a new property. Returns `{ id, slug }`. */
export async function adminCreateProperty(
  payload: PropertyPayload
): Promise<{ id: string; slug: string }> {
  const res = await fetch(`${API_URL}/api/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create property");
  return data;
}

/** Update an existing property by Firestore id. */
export async function adminUpdateProperty(
  id: string,
  payload: Partial<PropertyPayload>
): Promise<void> {
  const res = await fetch(`${API_URL}/api/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update property");
}

/** Delete a property by Firestore id. */
export async function adminDeleteProperty(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/properties/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete property");
}

/** Update a room. Returns 409 if any bed is occupied. */
export async function adminUpdateRoom(
  propertyId: string,
  roomId: string,
  payload: Partial<RoomPayload>
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/properties/${propertyId}/rooms/${roomId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update room");
}

/** Delete a room. Returns 409 if any bed is occupied or reserved. */
export async function adminDeleteRoom(
  propertyId: string,
  roomId: string
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/properties/${propertyId}/rooms/${roomId}`,
    { method: "DELETE" }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete room");
}

// ── New /api/property-rooms helpers ──────────────────────────────────────────

/** Payload sent to POST /api/property-rooms or PUT /api/property-rooms/:id */
export interface RoomPayload {
  id: string;
  hostel_slug: string;
  name?: string;
  price: number;
  per_day_price?: number;
  sharing: number;
  hasAC: boolean;
  available: boolean;
  floor?: number;
  mandatory_min_stay?: number;
  images: string[];
  panoramaUrl?: string;
  beds: BedPayload[];
  roomTenantEmail?: string;
  roomBookingId?: string;
}

export interface BedPayload {
  id: string;
  label?: string;
  status: "available" | "reserved" | "occupied";
  yaw?: number;
  pitch?: number;
  reservedAt?: string | null;
  tenantEmail?: string;
  bookingId?: string;
}

/** List rooms for a property slug. */
export async function adminGetRooms(slug: string): Promise<(RoomPayload & { firestoreId: string })[]> {
  const res = await fetch(
    `${API_URL}/api/property-rooms?slug=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch rooms");
  const data = await res.json();
  return data.rooms ?? [];
}

/** Fetch a single room by its Firestore document id. */
export async function adminGetRoom(firestoreId: string): Promise<RoomPayload & { firestoreId: string }> {
  const res = await fetch(`${API_URL}/api/property-rooms/${firestoreId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Room not found");
  return res.json();
}

/** Create a room. Returns { firestoreId, id, hostel_slug }. */
export async function adminCreateRoom(
  payload: RoomPayload
): Promise<{ firestoreId: string; id: string; hostel_slug: string }> {
  const res = await fetch(`${API_URL}/api/property-rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create room");
  return data;
}

/** Update a room (partial). Returns 409 if any bed is occupied. */
export async function adminUpdatePropertyRoom(
  firestoreId: string,
  payload: Partial<Omit<RoomPayload, "id" | "hostel_slug">>
): Promise<void> {
  const res = await fetch(`${API_URL}/api/property-rooms/${firestoreId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update room");
}

/** Delete a room. Returns 409 if any bed is occupied or reserved. */
export async function adminDeletePropertyRoom(firestoreId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/property-rooms/${firestoreId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete room");
}

/** Add a bed to a room. Returns 409 if room has occupied beds. */
export async function adminAddBed(
  roomFirestoreId: string,
  bed: BedPayload
): Promise<void> {
  const res = await fetch(`${API_URL}/api/property-rooms/${roomFirestoreId}/beds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bed),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to add bed");
}

/** Update a bed's label/yaw/pitch. Returns 409 if bed is occupied. */
export async function adminUpdateBed(
  roomFirestoreId: string,
  bedId: string,
  updates: { label?: string; yaw?: number; pitch?: number }
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/property-rooms/${roomFirestoreId}/beds/${bedId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update bed");
}

/** Delete a bed. Returns 409 if bed is occupied or reserved. */
export async function adminDeleteBed(
  roomFirestoreId: string,
  bedId: string
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/property-rooms/${roomFirestoreId}/beds/${bedId}`,
    { method: "DELETE" }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete bed");
}

export async function adminAssignTenant(
  roomFirestoreId: string,
  payload: {
    tenantEmail: string;
    propertyId: string;
    propertyName: string;
    bedId?: string;
    // Manual booking details
    checkIn?: string;
    checkOut?: string;
    paymentMethod?: string;
    paymentAmount?: number;
    paymentDate?: string;
    upiId?: string;
  }
): Promise<void> {
  const res = await fetch(`${API_URL}/api/property-rooms/${roomFirestoreId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to assign tenant");
}
