// src/types/property.ts
// Unified property data model — supports PG, hotel, and co-living

export type PropertyType = "pg" | "hotel" | "coliving";

export type PricingUnit = "month" | "night";

export type GenderType = "men" | "women" | "coed";

/** Lightweight shape used by property listing cards */
export interface PropertyCardProps {
  id: string;
  slug: string;
  name: string;
  propertyType: PropertyType;
  city: string;
  area: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  price: number;
  pricingUnit: PricingUnit;
  verified: boolean;
  amenities: string[];
  gender?: GenderType;
}

/** Full property detail — returned by GET /api/hostels/:slug */
export interface Property extends PropertyCardProps {
  description: string;
  location: string;       // full address string from server
  googleMapsLink?: string;
  images: string[];
  rooms?: Room[];
  owner_contact?: string;
  owner_name?: string;
  owner_email?: string;
  owner_mail?: string;
}

/** Room within a property */
export interface Room {
  id: string;
  firestoreId?: string;
  hostel_slug: string;
  name?: string;
  price: number;
  sharing: number;        // 1 | 2 | 3 | 4
  hasAC: boolean;
  available: boolean;
  floor?: number;
  images: string[];
  panoramaUrl?: string;
  beds: Bed[];
}

export interface Bed {
  id: string;
  label?: string;            // optional display name, e.g. "Bed A", "Top Bunk"
  status: "available" | "reserved" | "occupied";
  yaw?: number;
  pitch?: number;
  reservedAt?: string | null;
}

/**
 * Adapter: maps the old server hostel shape → PropertyCardProps
 *
 * Old server fields (from hostels.js + hostel.schema.js):
 *   name, slug, city, location, gender ("Men"/"Women"/"Unisex"),
 *   starting_price, rating, reviews, images[], description, ...
 *
 * New frontend fields:
 *   name, slug, city, area, propertyType, gender ("men"/"women"/"coed"),
 *   price, pricingUnit, rating, reviewCount, thumbnail, verified, amenities
 */
export function mapHostelToPropertyCard(hostel: Record<string, any>): PropertyCardProps {
  // Normalise gender casing: server uses "Men"/"Women"/"Unisex"
  const rawGender = (hostel.gender ?? "").toLowerCase();
  const gender: GenderType =
    rawGender === "men" || rawGender === "women" ? rawGender : "coed";

  // Determine property type: default to "pg" for legacy hostels; use
  // hostel.propertyType if the server already has the updated field
  const propertyType: PropertyType =
    hostel.propertyType ?? (hostel.type === "hotel" ? "hotel" : "pg");

  // Pricing unit: hotels → night, PGs/co-living → month
  const pricingUnit: PricingUnit =
    hostel.pricingUnit ?? (propertyType === "hotel" ? "night" : "month");

  // Derive "area" from the location string when the dedicated field is absent.
  // Convention: location strings are often "Area, City" or just the area name.
  const area: string =
    hostel.area ??
    (hostel.location?.split(",")?.[0]?.trim() || hostel.location || "");

  return {
    id: hostel.id ?? "",
    slug: hostel.slug ?? "",
    name: hostel.name ?? "",
    propertyType,
    city: hostel.city ?? "",
    area,
    thumbnail: hostel.thumbnail ?? hostel.images?.[0] ?? "",
    rating: hostel.rating ?? 0,
    reviewCount: hostel.reviewCount ?? hostel.reviews ?? 0,
    price: hostel.price ?? hostel.starting_price ?? 0,
    pricingUnit,
    verified: hostel.verified ?? false,
    amenities: hostel.amenities ?? [],
    gender,
  };
}
