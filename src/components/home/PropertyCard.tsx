"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ShieldCheck } from "lucide-react";

import { formatINR } from "@/lib/utils";
import type { PropertyCardProps } from "@/types/property";

// Re-export so existing imports from this file keep working
export type { PropertyCardProps } from "@/types/property";

type TypeMeta = { label: string; bgClass: string; textClass: string };

const TYPE_META: Record<string, TypeMeta> = {
  "pg-men": {
    label: "Men's PG",
    bgClass: "bg-teal-500",
    textClass: "text-white",
  },
  "pg-women": {
    label: "Women's PG",
    bgClass: "bg-violet-500",
    textClass: "text-white",
  },
  "pg-coed": {
    label: "Co-ed PG",
    bgClass: "bg-sky-500",
    textClass: "text-white",
  },
  coliving: {
    label: "Co-Living",
    bgClass: "bg-amber-500",
    textClass: "text-white",
  },
  hotel: {
    label: "Hotel",
    bgClass: "bg-slate-800",
    textClass: "text-white",
  },
};

function getTypeMeta(property: PropertyCardProps): TypeMeta {
  if (property.propertyType === "hotel") return TYPE_META.hotel;
  if (property.propertyType === "coliving") return TYPE_META.coliving;
  const key = `pg-${property.gender ?? "coed"}`;
  return TYPE_META[key] ?? TYPE_META["pg-coed"];
}

export default function PropertyCard({
  property,
}: {
  property: PropertyCardProps;
}) {
  const meta = getTypeMeta(property);
  const href = `/properties/${property.slug}`;

  return (
    <Link href={href} className="group block">
      {/* ── Image ─────────────────────────────────────────────────── */}
      <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 shadow-sm">
        <Image
          src={property.thumbnail}
          alt={`${property.name} in ${property.area}, ${property.city}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />

        {/* Type badge — top left */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${meta.bgClass} ${meta.textClass}`}
          >
            {meta.label}
          </span>
        </div>

        {/* Rating badge — top right */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold flex items-center gap-1 shadow-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" strokeWidth={0} />
          <span>{Number(property.rating).toFixed(1)}</span>
          {property.reviewCount > 0 && (
            <span className="text-slate-400 font-normal">
              ({property.reviewCount})
            </span>
          )}
        </div>

        {/* Verified badge — bottom left, shown when verified */}
        {property.verified && (
          <div className="absolute bottom-3 left-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-white">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* ── Info row ──────────────────────────────────────────────── */}
      <div className="mt-4 flex justify-between items-start gap-4">
        {/* Left: name + location */}
        <div className="min-w-0 flex-1">
          <h3
            itemProp="name"
            className="font-semibold text-base leading-tight line-clamp-2 text-slate-900 group-hover:text-violet-600 transition-colors duration-200"
          >
            {property.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span itemProp="address" className="truncate">
              {property.area}, {property.city}
            </span>
          </p>
        </div>

        {/* Right: price */}
        <div className="text-right shrink-0">
          <div className="text-base font-bold text-slate-900">
            {formatINR(property.price)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">
            per {property.pricingUnit === "night" ? "night" : "month"}
          </div>
        </div>
      </div>
    </Link>
  );
}