import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResults from "./SearchResults";


export const metadata: Metadata = {
  title: "Search Stays",
  description:
    "Browse verified PGs, coliving spaces, and hotels across India. Filter by city, type, and gender.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-10/12 w-full mx-auto px-4 sm:px-6 py-8">
          <div className="h-10 w-56 rounded-2xl bg-slate-100 animate-pulse mb-2" />
          <div className="h-4 w-32 rounded-xl bg-slate-100 animate-pulse mb-8" />
          <div className="h-20 rounded-3xl bg-slate-100 animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-4/3 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
