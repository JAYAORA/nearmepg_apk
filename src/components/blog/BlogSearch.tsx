"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export default function BlogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(currentQuery);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      next.set("q", query.trim());
    } else {
      next.delete("q");
    }
    router.push(`${pathname}?${next.toString()}`);
  }, [query, pathname, searchParams, router]);

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto mb-10">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 shadow-sm"
      />
      <button type="submit" className="hidden">Search</button>
    </form>
  );
}
