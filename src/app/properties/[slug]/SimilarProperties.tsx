import { getProperties } from "@/lib/api";
import PropertyCard from "@/components/home/PropertyCard";

interface SimilarPropertiesProps {
  currentPropertyId: string;
  city: string;
}

export default async function SimilarProperties({ currentPropertyId, city }: SimilarPropertiesProps) {
  let similar: any[] = [];
  try {
    const allProperties = await getProperties();
    similar = allProperties.filter(
      (p) => p.city.toLowerCase() === city.toLowerCase() && p.id !== currentPropertyId
    ).slice(0, 4);

    console.log("similar:", similar);
    console.log("all:", allProperties);
  } catch (error) {
    return null;
  }

  if (similar.length === 0) return null;

  return (
    <div className="mt-16 border-t border-slate-100 pt-12">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
        Similar properties in {city}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similar.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
