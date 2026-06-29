"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapPin, SlidersHorizontal, X, Search } from "lucide-react";

import PropertyCard from "@/components/home/PropertyCard";
import { getProperties } from "@/lib/api";
import { CITIES, type City } from "@/lib/constants";
import type { PropertyCardProps } from "@/types/property";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type StayKind = "pg" | "hotel" | "coliving" | "";
type Gender = "men" | "women" | "coed" | "";

// ─────────────────────────────────────────────
// Chip helper
// ─────────────────────────────────────────────
function chipClass(active: boolean) {
  return `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
    active
      ? "bg-amber-600 text-white shadow-sm"
      : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-slate-200"
  }`;
}

// ─────────────────────────────────────────────
// Skeleton card
// ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="group block">
      <div className="aspect-4/3 rounded-3xl bg-slate-100 animate-pulse" />
      <div className="mt-4 flex justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-3 w-1/2 rounded-lg bg-slate-100 animate-pulse" />
        </div>
        <div className="space-y-1 text-right">
          <div className="h-4 w-16 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-3 w-10 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function SearchResults() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL params
  const paramCity = (searchParams.get("city") ?? "") as City | "";
  const paramKind = (searchParams.get("kind") ?? "") as StayKind;
  const paramGender = (searchParams.get("gender") ?? "") as Gender;
  const paramQuery = searchParams.get("query") ?? "";

  // Local state
  const [allProperties, setAllProperties] = useState<PropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all properties once
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProperties()
      .then((data) => {
        if (!cancelled) {
          setAllProperties(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Helper: update a single search param while preserving the rest
  const setParam = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.replace(pathname, { scroll: false });

  // Count active filters
  const activeCount = [paramCity, paramKind, paramGender, paramQuery].filter(Boolean).length;

  // Client-side filter logic
  const results = useMemo<PropertyCardProps[]>(() => {
    return allProperties.filter((p) => {
      // City filter
      if (paramCity && p.city.toLowerCase() !== paramCity.toLowerCase()) return false;

      // Kind / coliving filter
      if (paramKind === "coliving") {
        if (p.propertyType !== "coliving") return false;
      } else if (paramKind === "hotel") {
        if (p.propertyType !== "hotel") return false;
      } else if (paramKind === "pg") {
        if (p.propertyType !== "pg") return false;
      }

      // Gender filter (PGs only)
      if (paramGender) {
        if (p.gender !== paramGender) return false;
      }

      // Query filter — name or area
      if (paramQuery) {
        const q = paramQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.area.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allProperties, paramCity, paramKind, paramGender, paramQuery]);

  // Page title
  const pageTitle = paramCity ? `Stays in ${paramCity}` : "All Stays";
  const subtitle = loading
    ? "Searching…"
    : `${results.length} ${results.length === 1 ? "property" : "properties"} found`;

  return (
    <main className="md:max-w-10/12 w-full mx-auto px-4 sm:px-6 py-8 pb-20">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search name, city or area..."
            value={paramQuery}
            onChange={(e) => setParam({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 text-sm bg-white"
          />
        </div>

        {/* Mobile filter toggle */}
        <button
          id="toggle-filters-btn"
          onClick={() => setShowFilters((s) => !s)}
          className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm hover:border-amber-400 transition-colors"
        >
          <SlidersHorizontal className="size-4" />
          Filters{activeCount > 0 && ` (${activeCount})`}
        </button>
      </div>

      {/* ── Filter Panel ──────────────────────────────────── */}
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } md:block bg-white border border-slate-200 rounded-3xl p-5 mb-8 shadow-soft`}
      >
        {/* Row 1 – Cities */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="filter-city-all"
            onClick={() => setParam({ city: "", gender: "" })}
            className={chipClass(!paramCity)}
          >
            All cities
          </button>
          {CITIES.map((c) => (
            <button
              key={c.name}
              id={`filter-city-${c.name.toLowerCase()}`}
              onClick={() => setParam({ city: c.name })}
              className={chipClass(paramCity === c.name)}
            >
              <MapPin className="size-3" />
              {c.name}
            </button>
          ))}
        </div>

        {/* Row 2 – Type */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mr-1">
            Type
          </span>
          <button
            id="filter-type-all"
            onClick={() => setParam({ kind: "", gender: "" })}
            className={chipClass(!paramKind && !paramGender)}
          >
            All
          </button>
          <button
            id="filter-type-pg"
            onClick={() => setParam({ kind: "pg", gender: "" })}
            className={chipClass(paramKind === "pg")}
          >
            PG
          </button>
          <button
            id="filter-type-hotel"
            onClick={() => setParam({ kind: "hotel", gender: "" })}
            className={chipClass(paramKind === "hotel")}
          >
            Hotels
          </button>
          <button
            id="filter-type-coliving"
            onClick={() => setParam({ kind: "coliving", gender: "" })}
            className={chipClass(paramKind === "coliving")}
          >
            Coliving
          </button>
          <button
            id="filter-type-men-pg"
            onClick={() => setParam({ kind: "pg", gender: "men" })}
            className={chipClass(paramKind === "pg" && paramGender === "men")}
          >
            Men's PG
          </button>
          <button
            id="filter-type-women-pg"
            onClick={() => setParam({ kind: "pg", gender: "women" })}
            className={chipClass(paramKind === "pg" && paramGender === "women")}
          >
            Women's PG
          </button>
          <button
            id="filter-type-coed-pg"
            onClick={() => setParam({ kind: "pg", gender: "coed" })}
            className={chipClass(paramKind === "pg" && paramGender === "coed")}
          >
            Co-ed PG
          </button>

          {/* Clear all */}
          {activeCount > 0 && (
            <button
              id="filter-clear-all"
              onClick={clearAll}
              className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="size-3" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Results Grid ──────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {results.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="text-center py-24 px-6 bg-[#FAF6F0] rounded-3xl">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            No stays match your filters
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Try removing a filter or browsing all cities — we add new properties regularly.
          </p>
          <button
            id="empty-state-clear-btn"
            onClick={clearAll}
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full bg-amber-600 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            See all stays
          </button>
        </div>
      )}
    </main>
  );
}
