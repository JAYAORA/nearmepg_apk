import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProperties } from "@/lib/api";
import PropertyCard from "./PropertyCard";

export default async function FeaturedProperties() {
  const properties = await getFeaturedProperties();

  return (
    <section className="md:max-w-10/12 w-full mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
            Featured
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
            Loved by our guests
          </h2>
        </div>
        <Link
          href="/search"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline"
        >
          View all <ArrowRight className="size-4" />
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-slate-400 text-center py-16">
          No featured properties available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}