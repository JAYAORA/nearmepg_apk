import { getProperty, getPropertyRooms, getPropertyReviews } from "@/lib/api";
import type { Property, Room } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  ShieldCheck,
  Star,
  ExternalLink,
  Share2,
  CheckCircle2Icon,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import PropertyInteractive from "./PropertyInteractive";
import ShareButton from "./ShareButton";
import SimilarProperties from "./SimilarProperties";
import PropertyReviews from "./PropertyReviews";

import UnverifiedGuard from "./UnverifiedGuard";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageProps = { params: Promise<{ slug: string }> };

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  let property: Property;
  try {
    property = await getProperty(slug);
  } catch {
    return { title: "Property Not Found" };
  }
  return {
    title: property.name,
    description: `${property.name} — Verified ${property.propertyType} in ${property.area}, ${property.city}. Starting from ${formatINR(property.price)} per ${property.pricingUnit}.`,
    openGraph: {
      images:
        property.images?.length > 0
          ? [property.images[0]]
          : property.thumbnail
            ? [property.thumbnail]
            : [],
    },
  };
}

// ─── Type badge helper ────────────────────────────────────────────────────────

function TypeBadge({ property }: { property: Property }) {
  const typeMap: Record<string, { label: string; bg: string; text: string }> = {
    "pg-men": { label: "Men's PG", bg: "bg-teal-100", text: "text-teal-800" },
    "pg-women": {
      label: "Women's PG",
      bg: "bg-violet-100",
      text: "text-violet-800",
    },
    "pg-coed": { label: "Co-ed PG", bg: "bg-sky-100", text: "text-sky-800" },
    coliving: {
      label: "Co-Living",
      bg: "bg-amber-100",
      text: "text-amber-800",
    },
    hotel: { label: "Hotel", bg: "bg-slate-100", text: "text-slate-800" },
  };

  const key =
    property.propertyType === "hotel"
      ? "hotel"
      : property.propertyType === "coliving"
        ? "coliving"
        : `pg-${property.gender ?? "coed"}`;

  const meta = typeMap[key] ?? typeMap["pg-coed"];

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.text}`}
    >
      {meta.label}
    </span>
  );
}

// ─── Amenity data ─────────────────────────────────────────────────────────────

type AmenityCategory = {
  label: string;
  color: string;
  bg: string;
  badge: string;
  badgeText: string;
  icon: string;
  items: Record<string, string>;
};

const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    label: "Connectivity",
    color: "border-blue-200",
    bg: "bg-blue-50/60",
    badge: "bg-blue-100",
    badgeText: "text-blue-800",
    icon: "📡",
    items: { WiFi: "📶", "High-Speed WiFi": "🚀", TV: "📺", Intercom: "📞" },
  },
  {
    label: "Comfort",
    color: "border-violet-200",
    bg: "bg-violet-50/60",
    badge: "bg-violet-100",
    badgeText: "text-violet-800",
    icon: "🛋️",
    items: {
      AC: "❄️",
      "Non-AC": "🌀",
      Fan: "🌬️",
      Heater: "🔥",
      Geyser: "♨️",
      "Attached Bathroom": "🚿",
      "Western Toilet": "🚽",
      Balcony: "🌅",
    },
  },
  {
    label: "Food & Services",
    color: "border-amber-200",
    bg: "bg-amber-50/60",
    badge: "bg-amber-100",
    badgeText: "text-amber-800",
    icon: "🍽️",
    items: {
      Food: "🍱",
      Breakfast: "☕",
      Lunch: "🥗",
      Dinner: "🍛",
      Laundry: "🧺",
      Housekeeping: "🧹",
      "Washing Machine": "🫧",
    },
  },
  {
    label: "Facilities",
    color: "border-teal-200",
    bg: "bg-teal-50/60",
    badge: "bg-teal-100",
    badgeText: "text-teal-800",
    icon: "🏋️",
    items: {
      Gym: "🏋️",
      "Swimming Pool": "🏊",
      "Study Room": "📚",
      "Common Room": "🛋️",
      Rooftop: "🌆",
      Cafeteria: "☕",
      Parking: "🅿️",
      Lift: "🛗",
    },
  },
  {
    label: "Security",
    color: "border-emerald-200",
    bg: "bg-emerald-50/60",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-800",
    icon: "🔒",
    items: {
      CCTV: "📷",
      Security: "💂",
      Gatekeeper: "🔐",
      "24/7 Water": "💧",
      Power: "⚡",
      "Power Backup": "🔋",
      Locker: "🔐",
    },
  },
];

function getAmenityMeta(amenity: string): {
  icon: string;
  badge: string;
  badgeText: string;
} {
  for (const cat of AMENITY_CATEGORIES) {
    if (cat.items[amenity]) {
      return {
        icon: cat.items[amenity],
        badge: cat.badge,
        badgeText: cat.badgeText,
      };
    }
  }
  return { icon: "✓", badge: "bg-slate-100", badgeText: "text-slate-700" };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let property: Property;
  let rooms: Room[] = [];
  let reviews: any[] = [];

  try {
    property = await getProperty(slug);
  } catch {
    notFound();
  }

  try {
    rooms = await getPropertyRooms(slug);
  } catch {
    rooms = [];
  }

  try {
    reviews = await getPropertyReviews(property.id);
  } catch {
    reviews = [];
  }

  const images =
    property.images?.length > 0 ? property.images : [property.thumbnail];
  const isPg = property.propertyType !== "hotel";

  // Derive Google Maps embed URL from the googleMapsLink if present
  let mapsEmbedSrc: string | null = null;
  if (property.googleMapsLink) {
    // Try to extract place/embed from share URL; fallback to search embed
    mapsEmbedSrc = `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(
      `${property.name}, ${property.area}, ${property.city}`,
    )}`;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": property.name,
    "description": property.description || "",
    "image": images,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.area,
      "addressRegion": property.city,
      "addressCountry": "IN"
    },
    "priceRange": `₹${property.price} - ₹${property.price * 3}`,
    "aggregateRating": property.reviewCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": property.rating,
      "reviewCount": property.reviewCount
    } : undefined
  };

  console.log(property);


  return (
    <UnverifiedGuard 
      verified={property.verified ?? false} 
      ownerEmail={property.owner_mail || property.owner_email || ""}
      ownerName={property.owner_name}
      ownerContact={property.owner_contact}
    >
      <main
        itemScope
        itemType="https://schema.org/LodgingBusiness"
        className="md:max-w-10/12 md:mx-auto w-full px-5 sm:px-6 py-5 sm:py-8 pb-20"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/search" className="hover:text-amber-600 transition-colors">
            Search
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-[200px]">
            {property.name}
          </span>
        </nav>

        {/* ── Gallery ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2.5 h-[260px] sm:h-[440px] rounded-3xl overflow-hidden mb-8 relative">
          {/* Main image */}
          <div className="col-span-4 sm:col-span-2 row-span-2 relative">
            <Image
              src={images[0]}
              alt={property.name}
              fill
              sizes="(max-width:640px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* 4 thumbnail images — desktop only */}
          {[1, 2, 3, 4].map((i) =>
            images[i] ? (
              <div key={i} className="hidden sm:block relative">
                <Image
                  src={images[i]}
                  alt={`${property.name} photo ${i + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            ) : (
              <div key={i} className="hidden sm:block bg-slate-100" />
            ),
          )}

          {/* Verified badge */}
          {property.verified && (
            <div className="absolute top-4 left-4">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-white">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            </div>
          )}

          {/* Photo count badge — mobile */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 sm:hidden">
              <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold">
                +{images.length - 1} photos
              </span>
            </div>
          )}
        </div>

        {/* ── Main layout: left content + right sticky card ─────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* ── LEFT: Property Info ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Type + Rating row */}
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <TypeBadge property={property} />
              <span className="inline-flex items-center gap-1 text-sm font-semibold">
                <Star
                  className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                  strokeWidth={0}
                />
                {Number(property.rating).toFixed(1)}
                {property.reviewCount > 0 && (
                  <span className="text-slate-400 font-normal text-xs">
                    ({property.reviewCount} reviews)
                  </span>
                )}
              </span>
            </div>

            {/* Name */}
            <h1
              itemProp="name"
              className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance"
            >
              {property.name}
            </h1>

            {/* Location */}
            <div className="mt-2 flex items-center gap-1.5 text-slate-500 text-sm flex-wrap">
              <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
              <span itemProp="address">
                {property.area}, {property.city}
              </span>
              {property.googleMapsLink && (
                <a
                  href={property.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-amber-600 hover:underline font-medium ml-1"
                >
                  View on Maps <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <p className="mt-6 text-slate-600 leading-relaxed text-[15px]">
                {property.description}
              </p>
            )}

            {/* ── Amenities ──────────────────────────────────────────────── */}
            {property.amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-xl font-bold mb-4">Amenities</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm">
                      <CheckCircle2Icon className="size-4 text-teal-700" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Interactive Section (rooms, filters, 360°, contact) ────── */}
            <PropertyInteractive
              property={{
                id: property.id,
                slug: property.slug,
                name: property.name,
                propertyType: property.propertyType,
                price: property.price,
                pricingUnit: property.pricingUnit,
                googleMapsLink: property.googleMapsLink,
                owner_contact: property.owner_contact,
                owner_name: property.owner_name,
                verified: property.verified,
              } as any}
              rooms={rooms}
              isPg={isPg}
            />

            {/* ── Google Maps ────────────────────────────────────────────── */}
            <div className="mt-12">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                Location
              </h2>
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-soft">
                {property.googleMapsLink ? (
                  <div className="aspect-video bg-slate-100 flex flex-col items-center justify-center gap-3 p-8 text-center">
                    <MapPin className="h-8 w-8 text-amber-500" />
                    <p className="text-slate-600 text-sm max-w-xs">
                      {property.area}, {property.city}
                    </p>
                    <a
                      href={property.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Google Maps
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.name}, ${property.area}, ${property.city}`)}&output=embed`}
                    className="w-full h-64 border-0"
                    loading="lazy"
                    title={`${property.name} location on map`}
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* ── Reviews ────────────────────────────────────────────────── */}
            <PropertyReviews 
              initialReviews={reviews} 
              propertyId={property.id} 
              rating={property.rating} 
              reviewCount={property.reviewCount} 
            />
          </div>

          {/* ── RIGHT: Sticky Price Card ──────────────────────────────────── */}
          <aside className="hidden lg:block md:w-[340px] shrink-0 order-first lg:order-last">
            <div className="lg:sticky lg:top-24 bg-white border border-slate-200 rounded-3xl p-6 shadow-warm">
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-bold text-slate-900">
                  {formatINR(property.price)}
                </span>
                <span className="text-sm text-slate-400">
                  / {property.pricingUnit === "night" ? "night" : "month"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Starting price · taxes included
              </p>

              {/* CTA */}
              {property.verified ? (
                <Link
                  href={`/properties/${property.slug}#rooms`}
                  className="mt-5 inline-flex w-full justify-center items-center gap-2 bg-linear-to-r from-orange-500 to-rose-600 text-white py-3.5 rounded-2xl font-semibold text-sm shadow-warm hover:opacity-95 transition-opacity"
                >
                  {isPg ? "Pick a bed" : "Select a room"}
                </Link>
              ) : (
                <button
                  disabled
                  title="Booking disabled: Property is unverified"
                  className="mt-5 inline-flex w-full justify-center items-center gap-2 bg-slate-200 text-slate-500 py-3.5 rounded-2xl font-semibold text-sm cursor-not-allowed"
                >
                  Booking Disabled
                </button>
              )}

              {/* Quick info */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Rating</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Star
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                      strokeWidth={0}
                    />
                    {Number(property.rating).toFixed(1)}
                    {property.reviewCount > 0 && (
                      <span className="text-slate-400 font-normal text-xs">
                        ({property.reviewCount})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Type</span>
                  <TypeBadge property={property} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">City</span>
                  <span className="font-semibold text-slate-800">
                    {property.city}
                  </span>
                </div>
                {property.verified && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Status</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Share */}
              <ShareButton property={property} />
            </div>
          </aside>
        </div>

        {/* ── Similar Properties ────────────────────────────────────────── */}
        <SimilarProperties currentPropertyId={property.id} city={property.city} />
      </main>
    </UnverifiedGuard>
  );
}

