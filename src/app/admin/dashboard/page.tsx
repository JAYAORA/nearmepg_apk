"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  CalendarCheck,
  CreditCard,
  Loader2,
  TrendingUp,
  AlertCircle,
  Home
} from "lucide-react";
import { useAuth, useIsAdmin } from "@/data/auth-context";
import { formatINR } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isAdmin) {
      setLoading(false);
      setError("Unauthorized access");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/admin/stats?callerRole=${user?.role}`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, isAdmin, user]);

  if (!isAuthenticated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-slate-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="md:max-w-10/12 md:mx-auto w-full px-5 sm:px-6 py-8 pb-20">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Admin Dashboard</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Platform wide statistics and metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="w-20 h-20 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Revenue</p>
            <h2 className="text-3xl font-black text-slate-900">{formatINR(stats?.totalRevenue || 0)}</h2>
            <div className="flex items-center gap-1 mt-3 text-emerald-600 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> All time sales
            </div>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <CalendarCheck className="w-20 h-20 text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Active Bookings</p>
            <h2 className="text-3xl font-black text-slate-900">{stats?.activeBookings || 0}</h2>
            <p className="text-slate-400 text-xs mt-3">Out of {stats?.totalBookings || 0} total bookings</p>
          </div>
        </div>

        {/* Total Properties */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-20 h-20 text-amber-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Properties</p>
            <h2 className="text-3xl font-black text-slate-900">{stats?.totalProperties || 0}</h2>
            <Link href="/admin/properties" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold mt-3">
              View Properties &rarr;
            </Link>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-20 h-20 text-violet-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Platform Users</p>
            <h2 className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</h2>
            {stats?.pendingOwners > 0 ? (
              <Link href="/admin/users" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold mt-3">
                {stats.pendingOwners} owners pending &rarr;
              </Link>
            ) : (
              <Link href="/admin/users" className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-700 text-xs font-semibold mt-3">
                Manage Users &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
