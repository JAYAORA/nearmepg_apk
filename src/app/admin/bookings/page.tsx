"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useIsAdmin } from "@/data/auth-context";

interface Booking {
  id: string;
  booking_code?: string;
  booking_status?: string;
  payment_status?: string;
  tenant_id?: string;
  tenant_email?: string;
  tenant_name?: string;
  property?: { hostelId?: string; hostelName?: string; location?: string };
  room?: { roomId?: string; roomName?: string; bedId?: string };
  booking_details?: Record<string, any>;
  pricing_breakdown?: Record<string, any>;
  created_at?: string;
  checkIn?: string;
  checkOut?: string;
}

function fmt(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status, type = "booking" }: { status?: string; type?: "booking" | "payment" }) {
  const map: Record<string, { label: string; cls: string }> = {
    "checked-in":   { label: "Active",     cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    "pending":      { label: "Pending",    cls: "bg-amber-100 text-amber-700 border-amber-200" },
    "checked-out":  { label: "Checked Out",cls: "bg-slate-100 text-slate-600 border-slate-200" },
    "completed":    { label: "Completed",  cls: "bg-slate-100 text-slate-600 border-slate-200" },
    "cancelled":    { label: "Cancelled",  cls: "bg-red-100 text-red-600 border-red-200" },
    "success":      { label: "Paid",       cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    "initiated":    { label: "Initiated",  cls: "bg-blue-100 text-blue-700 border-blue-200" },
    "failed":       { label: "Failed",     cls: "bg-red-100 text-red-600 border-red-200" },
  };
  const s = (status || "").toLowerCase();
  const cfg = map[s] ?? { label: status ?? "—", cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export default function AdminBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  async function fetchBookings() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        role: user.role,
        userEmail: user.email,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/bookings?${params}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      setBookings(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated || !user) { router.replace("/login?redirect=/admin/bookings"); return; }
    if (!isAdmin) { router.replace("/"); return; }
    fetchBookings();
  }, [authReady, isAuthenticated, user, isAdmin, router, statusFilter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchBookings();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">All Bookings</h1>
              <p className="text-sm text-slate-500">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} shown</p>
            </div>
            <button
              onClick={() => {
                if (bookings.length === 0) return;
                const header = ["Booking ID", "Tenant Name", "Tenant Email", "Property", "Room", "Status", "Payment Status", "Check In", "Check Out", "Amount"].join(",");
                const rows = bookings.map(b => [
                  b.id,
                  `"${b.tenant_name || ""}"`,
                  `"${b.tenant_email || ""}"`,
                  `"${b.property?.hostelName || ""}"`,
                  `"${b.room?.roomName || b.room?.roomId || ""}"`,
                  b.booking_status || "",
                  b.payment_status || "",
                  fmt(b.checkIn || b.booking_details?.checkIn || b.created_at),
                  fmt(b.checkOut || b.booking_details?.checkOut || b.booking_details?.actualEndDate),
                  b.pricing_breakdown?.finalAmountPaid || ""
                ].join(","));
                const csv = [header, ...rows].join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `bookings_export_${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              disabled={bookings.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by tenant, property, booking code…"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Search
              </button>
            </form>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="checked-in,pending">Active</option>
              <option value="checked-in">Checked-in</option>
              <option value="pending">Pending</option>
              <option value="checked-out,completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchBookings} className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold">Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No bookings found.</div>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                >
                  <div className="flex items-center gap-3 flex-wrap min-w-0">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{b.tenant_name || b.tenant_email || "—"}</p>
                      <p className="text-xs text-slate-500 truncate">{b.property?.hostelName} · {b.room?.roomName || b.room?.roomId || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                    <StatusBadge status={b.booking_status} />
                    <StatusBadge status={b.payment_status} type="payment" />
                    <span className="text-xs text-slate-400 font-mono">{b.booking_code || b.id.slice(0, 8)}</span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${expanded === b.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {expanded === b.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 text-sm">
                    <InfoCell label="Tenant Email" value={b.tenant_email} />
                    <InfoCell label="Property" value={b.property?.hostelName} />
                    <InfoCell label="Location" value={b.property?.location} />
                    <InfoCell label="Room" value={b.room?.roomName || b.room?.roomId} />
                    {b.room?.bedId && <InfoCell label="Bed" value={`Bed ${b.room.bedId}`} />}
                    <InfoCell label="Check-in" value={fmt(b.checkIn || b.booking_details?.checkIn || b.created_at)} />
                    <InfoCell label="Check-out" value={fmt(b.checkOut || b.booking_details?.checkOut || b.booking_details?.actualEndDate)} />
                    <InfoCell label="Amount" value={b.pricing_breakdown?.finalAmountPaid ? `₹${Number(b.pricing_breakdown.finalAmountPaid).toLocaleString("en-IN")}` : undefined} />
                    <InfoCell label="Booked On" value={fmt(b.created_at)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value?: string }) {
  return (
    <div className="py-2">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value || "—"}</p>
    </div>
  );
}
