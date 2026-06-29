import { mapHostelToPropertyCard } from "@/types/property";
import type { Property, PropertyCardProps, Room } from "@/types/property";
import { getDemoProperty, getDemoRooms } from "@/data/hotel-demo";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Fetch all public properties (no owner info). */
export async function getProperties(): Promise<PropertyCardProps[]> {
  const response = await fetch(`${API_URL}/api/properties`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  const data: Record<string, any>[] = await response.json();
  return data.map(mapHostelToPropertyCard);
}

/** Fetch top-rated featured properties (sorted by rating, limited to 6). */
export async function getFeaturedProperties(): Promise<PropertyCardProps[]> {
  const response = await fetch(`${API_URL}/api/properties/featured`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch featured properties");
  }

  const data: Record<string, any>[] = await response.json();
  return data.map(mapHostelToPropertyCard);
}

/** Fetch a single property by slug or id. Returns the full Property detail. */
export async function getProperty(slug: string): Promise<Property> {
  // Demo fallback — return simulated data without needing the API
  const demo = getDemoProperty(slug);

  try {
    const response = await fetch(`${API_URL}/api/properties/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      if (demo) return demo;
      throw new Error("Property not found");
    }

    const hostel: Record<string, any> = await response.json();
    const card = mapHostelToPropertyCard(hostel);
    return {
      ...card,
      description: hostel.description ?? "",
      location: hostel.location ?? "",
      googleMapsLink: hostel.google_maps_link,
      images: hostel.images ?? [],
      owner_contact: hostel.owner_contact,
      owner_name: hostel.owner_name,
    };
  } catch {
    if (demo) return demo;
    throw new Error("Property not found");
  }
}

/** Fetch rooms for a property by slug. */
export async function getPropertyRooms(slug: string): Promise<Room[]> {
  // Demo fallback
  const demoRooms = getDemoRooms(slug);

  try {
    const response = await fetch(`${API_URL}/api/property-rooms?slug=${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (demoRooms) return demoRooms;
      throw new Error("Rooms not found");
    }

    const data: { rooms: Record<string, any>[] } = await response.json();
    return data.rooms as Room[];
  } catch {
    if (demoRooms) return demoRooms;
    throw new Error("Rooms not found");
  }
}

/** Fetch properties owned by a given email (authenticated owner dashboard use). */
export async function getOwnerProperties(
  email: string
): Promise<PropertyCardProps[]> {
  const response = await fetch(
    `${API_URL}/api/properties?email=${encodeURIComponent(email)}`,
    {
      // No caching for owner-specific data
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch owner properties");
  }

  const data: Record<string, any>[] = await response.json();
  return data.map(mapHostelToPropertyCard);
}

/** Reserve a hotel room (starts 8-min timer) */
export async function reserveRoom(roomId: string, reservationToken?: string, checkIn?: string, checkOut?: string): Promise<{ reservedUntil: string }> {
  const response = await fetch(`${API_URL}/api/property-rooms/${roomId}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservationToken, checkIn, checkOut }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to reserve room");
  }
  return response.json();
}

/** Release a hotel room */
export async function releaseRoom(roomId: string): Promise<void> {
  await fetch(`${API_URL}/api/property-rooms/${roomId}/release`, {
    method: "POST",
    keepalive: true,
  });
}

/** Reserve a PG bed (starts 8-min timer) */
export async function reserveBed(roomId: string, bedId: string, reservationToken?: string): Promise<{ reservedUntil: string }> {
  const response = await fetch(`${API_URL}/api/property-rooms/${roomId}/beds/${bedId}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservationToken }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to reserve bed");
  }
  return response.json();
}

/** Release a PG bed */
export async function releaseBed(roomId: string, bedId: string): Promise<void> {
  await fetch(`${API_URL}/api/property-rooms/${roomId}/beds/${bedId}/release`, {
    method: "POST",
    keepalive: true,
  });
}

/** Initiate payment */
export async function initiatePayment(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_URL}/api/payments/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Payment initiation failed");
  }
  return response.json();
}

/** Verify payment */
export async function verifyPayment(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Payment verification failed");
  }
  return response.json();
}

/** Fetch reviews for a property */
export async function getPropertyReviews(propertyId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/api/properties/${propertyId}/reviews`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}