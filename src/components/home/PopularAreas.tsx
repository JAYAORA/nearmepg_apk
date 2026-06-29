import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CITIES } from "@/lib/constants";

export default function PopularAreas() {
  return (
    <section className="max-w-10/12 w-full mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
            Popular cities
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
            Pick where you're headed
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {CITIES.map((c) => (
          <Link
            key={c.name}
            href={`/search?city=${c.name}`}
            className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 hover:border-amber-600 transition-colors shadow-soft"
          >
            {/* <div className="text-4xl">{c.emoji}</div> */}
            <div className="font-display font-bold text-lg text-slate-800">{c.name}</div>
            <div className="text-xs text-slate-500 mt-1">{c.tag}</div>
            <ArrowRight className="absolute bottom-5 right-6 size-5 text-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0 -translate-x-3" />
          </Link>
        ))}
      </div>
    </section>
  );
}