"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useIsOwner, useIsAdmin } from "@/data/auth-context";
import { getOwnerProperties } from "@/lib/api";
import { formatINR } from "@/lib/utils";
import type { PropertyCardProps } from "@/types/property";

export default function OwnerDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const isOwner = useIsOwner();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated || !user) {
      router.replace("/login?redirect=/owner");
      return;
    }
    if (!isOwner && !isAdmin) {
      router.replace("/");
      return;
    }
    async function load() {
      try {
        const [propsData, statsRes] = await Promise.all([
          getOwnerProperties(user!.email),
          fetch(`/api/owner/stats?email=${encodeURIComponent(user!.email)}&role=${user!.role}`)
        ]);
        setProperties(propsData);
        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authReady, isAuthenticated, user, isOwner, isAdmin, router]);

  if (!authReady || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Owner Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage your properties and tenants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/owner/payments"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payments
              </Link>
              <Link
                href="/owner/tenants"
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                My Tenants
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Revenue"
            value={formatINR(stats?.totalRevenue || 0)}
            color="emerald"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            label="Total Properties"
            value={String(properties.length)}
            color="amber"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            label="Occupancy Rate"
            value={`${stats?.occupancyRate || 0}%`}
            color="blue"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label="My Tenants"
            value="View →"
            color="violet"
            href="/owner/tenants"
          />
        </div>

        {/* Dashboard 2-col Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue per property */}
            {stats?.propertyStats && stats.propertyStats.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue by Property</h3>
                <div className="space-y-4">
                  {stats.propertyStats.map((p: any, i: number) => {
                    const percentage = stats.totalRevenue > 0 ? (p.revenue / stats.totalRevenue) * 100 : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-semibold text-slate-700">{p.name || "Unnamed Property"}</span>
                          <span className="font-bold text-emerald-600">{formatINR(p.revenue)}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Properties list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">My Properties</h2>
                <Link href="/admin/properties/new" className="text-sm font-semibold text-amber-600 hover:text-amber-700">+ Add New</Link>
              </div>
              {properties.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm">No properties found for your account.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {properties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upcoming (14 Days)
                </h3>
              </div>
              <div className="p-0">
                {!stats?.upcomingEvents || stats.upcomingEvents.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No upcoming check-ins or check-outs.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {stats.upcomingEvents.map((ev: any, i: number) => (
                      <li key={i} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{ev.tenantName}</p>
                            <p className="text-xs text-slate-500">{ev.property} · {ev.room}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              ev.type === "check-in" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                            }`}>
                              {ev.type}
                            </span>
                            <p className="text-xs font-semibold text-slate-700 mt-1">
                              {new Date(ev.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "amber" | "emerald" | "blue" | "violet";
  href?: string;
}) {
  const colorMap = {
    amber: "from-amber-500 to-orange-500",
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-indigo-500",
    violet: "from-violet-500 to-purple-500",
  };
  const content = (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

function PropertyCard({ property }: { property: PropertyCardProps }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="h-36 bg-slate-100 overflow-hidden">
        {property.thumbnail ? (
          <img src={property.thumbnail} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-slate-900 text-sm leading-snug">{property.name}</h3>
          {property.verified && (
            <span className="flex-shrink-0 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">Verified</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-3">{property.area}, {property.city}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-amber-600">₹{property.price.toLocaleString("en-IN")}<span className="text-xs font-normal text-slate-400">/{property.pricingUnit}</span></span>
          <Link
            href={`/admin/properties/${property.id}/edit`}
            className="text-xs font-semibold text-slate-600 hover:text-amber-600 transition-colors"
          >
            Manage →
          </Link>
        </div>
      </div>
    </div>
  );
}
