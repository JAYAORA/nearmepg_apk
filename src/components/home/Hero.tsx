"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
} from "lucide-react";

import { CITIES } from "@/lib/constants";
import type { City } from "@/lib/constants";

type StayKind = "any" | "pg" | "hotel";

const Hero = () => {
  const router = useRouter();
  const [city, setCity] = useState<City | "">("");
  const [kind, setKind] = useState<StayKind>("any");
  const [query, setQuery] = useState("");
  const [viewingCount, setViewingCount] = useState(5);

  useEffect(() => {
    setViewingCount(Math.floor(Math.random() * 10) + 1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (kind !== "any") params.set("kind", kind);
    if (query) params.set("query", query);

    router.push(`/search?${params.toString()}`);
  };

  return (
    // <section className="relative overflow-hidden bg-background">
    //   <div className="absolute inset-0 gradient-warm opacity-80" />
    //   <div className="absolute -top-20 -right-20 size-96 rounded-full bg-amber-500/10 blur-3xl" />
    //   <div className="absolute top-40 -left-20 size-80 rounded-full bg-teal-500/10 blur-3xl" />

    //   <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 md:pt-24 md:pb-32">
    //     <div className="max-w-3xl">
    //       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-slate-200 text-xs font-semibold text-amber-700">
    //         <Sparkles className="size-3.5" /> 4 cities · 16+ curated stays
    //       </div>
    //       <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance tracking-tight">
    //         Find a stay that feels like <span className="text-amber-600">home.</span>
    //       </h1>
    //       <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
    //         Cozy PGs, vibrant coliving, and boutique hotels across India's busiest cities — booked in minutes.
    //       </p>
    //     </div>

    //
    //     <form
    //       onSubmit={handleSearch}
    //       className="mt-10 bg-white border border-slate-200 rounded-3xl p-2 shadow-warm flex flex-col md:flex-row items-stretch gap-2 max-w-4xl"
    //     >
    //       <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
    //         <label className="p-4 cursor-pointer flex flex-col justify-center">
    //           <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">City</div>
    //           <select
    //             value={city}
    //             onChange={(e) => setCity(e.target.value as City | "")}
    //             className="w-full bg-transparent outline-none text-sm font-medium appearance-none cursor-pointer text-slate-800"
    //           >
    //             <option value="">Any city</option>
    //             {CITIES.map((c) => (
    //               <option key={c.name} value={c.name}>
    //                 {c.name}
    //               </option>
    //             ))}
    //           </select>
    //         </label>

    //         <label className="p-4 cursor-pointer flex flex-col justify-center">
    //           <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Stay type</div>
    //           <select
    //             value={kind}
    //             onChange={(e) => setKind(e.target.value as StayKind)}
    //             className="w-full bg-transparent outline-none text-sm font-medium appearance-none cursor-pointer text-slate-800"
    //           >
    //             <option value="any">Anything</option>
    //             <option value="pg">PG / Coliving</option>
    //             <option value="hotel">Hotel</option>
    //           </select>
    //         </label>

    //         <label className="p-4 cursor-text flex flex-col justify-center">
    //           <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Search</div>
    //           <input
    //             type="text"
    //             value={query}
    //             onChange={(e) => setQuery(e.target.value)}
    //             placeholder="Area or property name"
    //             className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-slate-400 text-slate-800"
    //           />
    //         </label>
    //       </div>

    //       <button
    //         type="submit"
    //         className="inline-flex items-center justify-center gap-2 gradient-sunset text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-warm hover:opacity-95 transition-opacity cursor-pointer"
    //       >
    //         <Search className="size-4" /> Search
    //       </button>
    //     </form>

    //     {/* Quick chips */}
    //     <div className="mt-6 flex flex-wrap gap-2">
    //       {[
    //         { label: "Men's PG", href: "/search?gender=men" },
    //         { label: "Women's PG", href: "/search?gender=women" },
    //         { label: "Coliving", href: "/search?kind=pg&type=coliving" },
    //         { label: "Boutique Hotels", href: "/search?kind=hotel" },
    //       ].map((chip) => (
    //         <Link
    //           key={chip.label}
    //           href={chip.href}
    //           className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-colors shadow-sm"
    //         >
    //           {chip.label}
    //         </Link>
    //       ))}
    //     </div>
    //   </div>
    // </section>
    // <section className="relative overflow-hidden bg-background">
    //   {/* Background Orbs with slow professional pulse animation */}
    //   <div className="absolute inset-0 gradient-warm opacity-80" />
    //   <div className="absolute -top-20 -right-20 size-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse [animation-duration:8s]" />
    //   <div className="absolute top-40 -left-20 size-80 rounded-full bg-teal-500/10 blur-3xl animate-pulse [animation-duration:12s]" />

    //   <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
    //     {/* Left Column: Content */}
    //     <div className="max-w-3xl flex-1">
    //       {/* Playful Pill Badge */}
    //       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-800 shadow-sm animate-fade-in">
    //         <Sparkles className="size-3.5 text-amber-500 animate-spin [animation-duration:3s]" />
    //         4 cities · 16+ curated stays
    //       </div>

    //       {/* Animated Headline */}
    //       <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-balance tracking-tight text-slate-900">
    //         Find a stay that feels like{" "}
    //         <span className="relative inline-block text-amber-600 whitespace-nowrap">
    //           home.
    //           {/* Professional SVG Underline Vector */}
    //           <svg
    //             className="absolute -bottom-2 left-0 w-full h-2 text-amber-400/60"
    //             viewBox="0 0 100 10"
    //             preserveAspectRatio="none"
    //           >
    //             <path
    //               d="M0,5 Q50,10 100,5"
    //               stroke="currentColor"
    //               strokeWidth="4"
    //               strokeLinecap="round"
    //               fill="none"
    //             />
    //           </svg>
    //         </span>
    //       </h1>

    //       <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
    //         Cozy PGs, vibrant coliving, and boutique hotels across India's
    //         busiest cities — booked in minutes.
    //       </p>

    //       {/* Search bar */}
    //       <form
    //         onSubmit={handleSearch}
    //         className="mt-10 bg-white border border-slate-200/80 rounded-3xl p-2 shadow-xl shadow-amber-500/5 flex flex-col md:flex-row items-stretch gap-2 max-w-4xl transition-all duration-300 focus-within:border-amber-400 focus-within:shadow-md focus-within:shadow-amber-500/10"
    //       >
    //         <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
    //           <label className="p-4 cursor-pointer flex flex-col justify-center group/field">
    //             <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 group-hover/field:text-amber-600 transition-colors">
    //               City
    //             </div>
    //             <select
    //               value={city}
    //               onChange={(e) => setCity(e.target.value as City | "")}
    //               className="w-full bg-transparent outline-none text-sm font-medium appearance-none cursor-pointer text-slate-800"
    //             >
    //               <option value="">Any city</option>
    //               {CITIES.map((c) => (
    //                 <option key={c.name} value={c.name}>
    //                   {c.name}
    //                 </option>
    //               ))}
    //             </select>
    //           </label>

    //           <label className="p-4 cursor-pointer flex flex-col justify-center group/field">
    //             <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 group-hover/field:text-amber-600 transition-colors">
    //               Stay type
    //             </div>
    //             <select
    //               value={kind}
    //               onChange={(e) => setKind(e.target.value as StayKind)}
    //               className="w-full bg-transparent outline-none text-sm font-medium appearance-none cursor-pointer text-slate-800"
    //             >
    //               <option value="any">Anything</option>
    //               <option value="pg">PG / Coliving</option>
    //               <option value="hotel">Hotel</option>
    //             </select>
    //           </label>

    //           <label className="p-4 cursor-text flex flex-col justify-center group/field">
    //             <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 group-hover/field:text-amber-600 transition-colors">
    //               Search
    //             </div>
    //             <input
    //               type="text"
    //               value={query}
    //               onChange={(e) => setQuery(e.target.value)}
    //               placeholder="Area or property name"
    //               className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-slate-400 text-slate-800"
    //             />
    //           </label>
    //         </div>

    //         <button
    //           type="submit"
    //           className="inline-flex items-center justify-center gap-2 gradient-sunset bg-linear-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-md hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
    //         >
    //           <Search className="size-4" /> Search
    //         </button>
    //       </form>

    //       {/* Quick chips with bouncing/hover micro-interactions */}
    //       <div className="mt-6 flex flex-wrap gap-2">
    //         {[
    //           { label: "Men's PG", href: "/search?gender=men" },
    //           { label: "Women's PG", href: "/search?gender=women" },
    //           { label: "Coliving", href: "/search?kind=pg&type=coliving" },
    //           { label: "Hotels", href: "/search?kind=hotel" },
    //         ].map((chip) => (
    //           <Link
    //             key={chip.label}
    //             href={chip.href}
    //             className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-linear-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
    //           >
    //             {chip.label}
    //           </Link>
    //         ))}
    //       </div>
    //     </div>

    //     {/* Right Column: Visual Elements (Hidden on mobile, beautiful dynamic anchors on desktop) */}
    //     <div className="hidden lg:flex flex-col gap-6 relative w-80 items-center justify-center">
    //       {/* Floating Card 1 */}
    //       <div className="absolute -top-12 -left-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-amber-100 rotate-[-4deg] animate-bounce [animation-duration:6s] flex items-center gap-3">
    //         <div className="p-2 bg-amber-500 text-white rounded-xl">⭐</div>
    //         <div>
    //           <p className="text-xs font-bold text-slate-800">
    //             4.8/5 Community Rating
    //           </p>
    //           <p className="text-[10px] text-slate-500">
    //             Trusted by 10k+ residents
    //           </p>
    //         </div>
    //       </div>

    //       {/* Floating Card 2 */}
    //       <div className="absolute top-16 -right-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-amber-100 rotate-[4deg] animate-bounce [animation-duration:5s] flex items-center gap-3">
    //         <div className="p-2 bg-orange-500 text-white rounded-xl">⚡</div>
    //         <div>
    //           <p className="text-xs font-bold text-slate-800">Zero Lock-in</p>
    //           <p className="text-[10px] text-slate-500">
    //             Move in, move out seamlessly
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <section className="relative overflow-hidden bg-background">
      {/* Background Orbs with slow professional pulse animation */}
      <div className="absolute inset-0 gradient-warm opacity-80" />
      <div className="absolute -top-20 -right-20 size-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse animation-duration-[8s]" />
      <div className="absolute top-40 -left-20 size-80 rounded-full bg-teal-500/10 blur-3xl animate-pulse animation-duration-[12s]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-8">
        {/* Left Column: Content */}
        <div className="max-w-3xl flex-1">
          {/* Playful Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-800 shadow-sm animate-fade-in">
            <Sparkles className="size-3.5 text-amber-500 animate-spin animation-duration-[3s]" />
            4 cities · 16+ curated stays
          </div>

          {/* Animated Headline */}
          <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-balance tracking-tight text-slate-900">
            Find a stay that feels like{" "}
            <span className="relative inline-block text-amber-600 whitespace-nowrap">
              home.
              {/* Professional SVG Underline Vector */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-2 text-amber-400/60"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,10 100,5"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
            Cozy PGs, vibrant coliving, and hotels across India's
            busiest cities — booked in minutes.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mt-10 bg-white border border-slate-200/80 rounded-3xl p-2 shadow-xl shadow-amber-500/5 flex flex-col md:flex-row items-stretch gap-2 max-w-4xl transition-all duration-300 focus-within:border-amber-400 focus-within:shadow-md focus-within:shadow-amber-500/10"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <label className="p-4 cursor-pointer flex flex-col justify-center group/field">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 group-hover/field:text-amber-600 transition-colors">
                  City
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as City | "")}
                  className="w-full bg-transparent outline-none text-sm font-medium appearance-none cursor-pointer text-slate-800"
                >
                  <option value="">Any city</option>
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="p-4 cursor-pointer flex flex-col justify-center group/field">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 group-hover/field:text-amber-600 transition-colors">
                  Stay type
                </div>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as StayKind)}
                  className="w-full bg-transparent outline-none text-sm font-medium appearance-none cursor-pointer text-slate-800"
                >
                  <option value="any">Anything</option>
                  <option value="pg">PG / Coliving</option>
                  <option value="hotel">Hotel</option>
                </select>
              </label>

              <label className="p-4 cursor-text flex flex-col justify-center group/field">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 group-hover/field:text-amber-600 transition-colors">
                  Search
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Area or property name"
                  className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-slate-400 text-slate-800"
                />
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 gradient-sunset bg-linear-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-md hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Search className="size-4" /> Search
            </button>
          </form>

          {/* Quick chips with bouncing/hover micro-interactions */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "Men's PG", href: "/search?gender=men" },
              { label: "Women's PG", href: "/search?gender=women" },
              { label: "Coliving", href: "/search?kind=pg&type=coliving" },
              { label: "Hotels", href: "/search?kind=hotel" },
            ].map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-linear-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Abstract Showcase (Fills desktop white space perfectly) */}
        {/* <div className="hidden lg:flex flex-1 max-w-md relative h-[450px] items-center justify-center pl-8">
          
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px] opacity-70 -z-10" />

          
          <div className="w-72 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl border border-slate-100 relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-36 bg-linear-to-br from-amber-100 to-orange-100 rounded-xl relative overflow-hidden flex items-center justify-center">
              <span className="text-3xl">🏡</span>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-bold text-emerald-700 flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />{" "}
                Verified
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    The Sunset Canopy
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Sector 45, Gurgaon
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-600">
                  ₹14,500/mo
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-500">
                <span>⚡ High-speed Wi-Fi</span>
                <span>🍽️ Food Included</span>
              </div>
            </div>
          </div>

          
          <div className="absolute top-8 left-0 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-amber-100 rotate-[-8deg] animate-bounce animation-duration-[6s] flex items-center gap-2.5 z-20">
            <div className="w-7 h-7 bg-amber-500 text-white rounded-lg flex items-center justify-center text-xs">
              ⭐
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">4.8/5 Rating</p>
              <p className="text-[9px] text-slate-400">10k+ happy residents</p>
            </div>
          </div>

          
          <div className="absolute right-0 top-1/3 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-orange-100 rotate-6 animate-bounce animation-duration-[5s] max-w-[160px] z-20">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Amenities
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-[9px] font-medium">
                Gym
              </span>
              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-medium">
                AC Rooms
              </span>
              <span className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[9px] font-medium">
                24/7 Power
              </span>
            </div>
          </div>

          
          <div className="absolute bottom-8 left-4 bg-slate-900 text-white p-2.5 rounded-xl shadow-xl rotate-3 animate-pulse animation-duration-[4s] flex items-center gap-2 z-20">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-amber-400 border border-slate-900 text-[8px] flex items-center justify-center">
                🧑
              </div>
              <div className="w-5 h-5 rounded-full bg-orange-400 border border-slate-900 text-[8px] flex items-center justify-center">
                👧
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-200">
              5 people looking right now
            </p>
          </div>
        </div> */}
        {/* Right Column: Enhanced Floating Ecosystem */}
        {/* Right Column: Living Marketplace System */}
        <div className="hidden lg:flex flex-1 max-w-md relative h-[500px] items-center justify-center pl-8 select-none">
          {/* Background Orbs with Deep Blurs */}
          <div className="absolute inset-0 -z-20 overflow-hidden">
            <div className="absolute top-0 left-4 w-80 h-80 bg-linear-to-tr from-amber-300/20 to-orange-300/20 blur-[60px] rounded-full animate-orb1" />
            <div className="absolute bottom-4 right-4 w-72 h-72 bg-linear-to-br from-teal-300/20 to-emerald-300/20 blur-[60px] rounded-full animate-orb2" />
          </div>

          {/* Refined Geometric Grid Base */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 -z-10" />

          {/* =========================================================
      MAIN CARD (The Sunset Canopy)
      ========================================================= */}
          <div className="w-76 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] border border-white/60 relative z-10 animate-float1 hover:shadow-[0_30px_70px_-10px_rgba(245,158,11,0.15)] transition-shadow duration-500">
            {/* Premium Image Header Card */}
            <div className="w-full h-40 bg-linear-to-br from-amber-200 via-orange-100 to-amber-50 rounded-xl flex items-center justify-center relative overflow-hidden group">
              {/* 3D Glass Accent Effect Inside Image */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="text-4xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                🏡
              </span>

              {/* Shimmer Sweep Line */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer1" />
              </div>

              {/* Live Glowing Verified Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-emerald-700 flex items-center gap-1.5 shadow-sm border border-emerald-100">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Verified
              </div>
            </div>

            {/* Details Section */}
            <div className="mt-3.5 px-0.5">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                    The Sunset Canopy
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5 flex items-center gap-0.5">
                    📍 Sector 45, Gurgaon
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100/50">
                    ₹14,500
                    <span className="text-[9px] font-medium text-amber-500">
                      /mo
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
      SATELLITE CARD 2 (Top Right)
      ========================================================= */}
          <div className="absolute -top-2 right-4 w-56 bg-white/75 backdrop-blur-md p-3.5 rounded-xl shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] border border-white/50 rotate-[5deg] z-20 animate-float2 hover:rotate-0 transition-transform duration-300">
            <div className="text-xs font-bold text-slate-800">
              Urban Nest PG
            </div>
            <div className="text-[10px] font-medium text-slate-400 mt-0.5">
              Koramangala, Bengaluru
            </div>
            <div className="mt-2 text-[10px] text-amber-600 font-bold bg-amber-50/60 inline-block px-1.5 py-0.5 rounded">
              ₹11,200/mo
            </div>
          </div>

          {/* =========================================================
      SATELLITE CARD 3 (Bottom Right)
      ========================================================= */}
          <div className="absolute bottom-10 right-4 w-54 bg-white/75 backdrop-blur-md p-3.5 rounded-xl shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] border border-white/50 rotate-[-4deg] z-20 animate-float3 hover:rotate-0 transition-transform duration-300">
            <div className="text-xs font-bold text-slate-800">
              Nova Coliving
            </div>
            <div className="text-[10px] font-medium text-slate-400 mt-0.5">
              Hitech City, Hyderabad
            </div>
            <div className="mt-2 text-[10px] text-amber-600 font-bold bg-amber-50/60 inline-block px-1.5 py-0.5 rounded">
              ₹13,900/mo
            </div>
          </div>

          {/* =========================================================
      BADGE: Live Rating (Top Left)
      ========================================================= */}
          <div className="absolute top-14 left-0 bg-white/80 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-amber-100/70 -rotate-6 flex items-center gap-2.5 z-20 animate-float2">
            <div className="w-7 h-7 bg-linear-to-br from-amber-400 to-orange-500 text-white rounded-lg flex items-center justify-center text-xs shadow-sm">
              ⭐
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-800 leading-none">
                4.8 / 5
              </p>
              <p className="text-[9px] font-semibold text-slate-400 mt-1">
                10k+ residents
              </p>
            </div>
          </div>

          {/* =========================================================
      BADGE: Amenities (Right Mid)
      ========================================================= */}
          <div className="absolute right-[-12px] top-[45%] -translate-y-1/2 bg-white/85 backdrop-blur-md p-3 rounded-xl shadow-xl border border-orange-100/70 rotate-3 z-20 w-44 animate-float3">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Premium Amenities
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 bg-orange-50/80 border border-orange-100 text-orange-700 rounded-md text-[9px] font-semibold">
                Gym
              </span>
              <span className="px-2 py-0.5 bg-amber-50/80 border border-amber-100 text-amber-700 rounded-md text-[9px] font-semibold">
                AC
              </span>
              <span className="px-2 py-0.5 bg-indigo-50/80 border border-indigo-100 text-indigo-700 rounded-md text-[9px] font-semibold">
                24/7 Power
              </span>
              <span className="px-2 py-0.5 bg-teal-50/80 border border-teal-100 text-teal-700 rounded-md text-[9px] font-semibold">
                WiFi
              </span>
            </div>
          </div>

          {/* =========================================================
      BADGE: Social Proof Counter (Bottom Left)
      ========================================================= */}
          <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl flex items-center gap-2.5 z-20 animate-float1 border border-slate-800">
            <div className="flex -space-x-2">
              <div className="w-5 h-5 rounded-full bg-linear-to-tr from-amber-400 to-orange-400 border-2 border-slate-900 shadow-sm" />
              <div className="w-5 h-5 rounded-full bg-linear-to-tr from-teal-400 to-emerald-400 border-2 border-slate-900 shadow-sm" />
              <div className="w-5 h-5 rounded-full bg-linear-to-tr from-indigo-400 to-purple-400 border-2 border-slate-900 shadow-sm" />
            </div>
            <p className="text-[10px] font-medium text-slate-200 tracking-wide flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-orange-400 animate-pulse" />
              {viewingCount} people viewing now
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
