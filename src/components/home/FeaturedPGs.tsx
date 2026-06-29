import Link from "next/link";

import { Button } from "@/components/ui/button";
import PGCard from "./PGCard";

import { getFeaturedProperties } from "@/lib/api";

export default async function FeaturedPGs() {
  const properties = await getFeaturedProperties();

  return (
    <div className="px-4 py-6 md:px-12 md:py-8 bg-white text-slate-900">
      <section className="mb-12">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col md:gap-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Featured Stays
            </h2>

            <p className="text-xs md:text-sm text-slate-500 mb-6">
              Top rated hostels for students and professionals
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            className="text-amber-600 text-sm md:text-base"
          >
            <Link href="/search">
              View All
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property) => (
            <PGCard
              key={property.id}
              slug={property.slug}
              name={property.name}
              type={property.gender === "men" ? "Men" : property.gender === "women" ? "Women" : "Coed"}
              city={property.city}
              location={property.area}
              price={property.price}
              rating={property.rating}
              img={property.thumbnail}
            />
          ))}
        </div>
      </section>
    </div>
  );
}