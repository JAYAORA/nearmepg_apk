"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useIsOwner, useIsAdmin } from "@/data/auth-context";

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

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    "checked-in": { label: "Active", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    "pending":    { label: "Pending", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    "checked-out": { label: "Checked Out", cls: "bg-slate-100 text-slate-600 border-slate-200" },
    "completed":  { label: "Completed", cls: "bg-slate-100 text-slate-600 border-slate-200" },
    "cancelled":  { label: "Cancelled", cls: "bg-red-100 text-red-600 border-red-200" },
  };
  const s = (status || "").toLowerCase();
  const cfg = map[s] ?? { label: status ?? "Unknown", cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

interface EarlyCheckoutModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

function EarlyCheckoutModal({ booking, onClose, onSuccess }: EarlyCheckoutModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${booking.id}/early-checkout`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actualCheckoutDate: date, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Process Early Checkout</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <p className="text-sm font-semibold text-amber-800">{booking.tenant_name || booking.tenant_email || "Tenant"}</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {booking.property?.hostelName} · {booking.room?.roomName || booking.room?.roomId}
              {booking.room?.bedId ? ` · Bed ${booking.room.bedId}` : ""}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Actual Checkout Date</label>
              <input
                type="date"
                required
                value={date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="e.g. Job change, personal reasons…"
                className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Processing…" : "Confirm Checkout"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function OwnerTenantsPage() {
  const { user, isAuthenticated } = useAuth();
  const isOwner = useIsOwner();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("checked-in,pending");
  const [earlyCheckoutBooking, setEarlyCheckoutBooking] = useState<Booking | null>(null);

  async function handleSendReminder(booking: Booking) {
    if (!user) return;
    try {
      const res = await fetch("/api/owner/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: booking.tenant_id,
          ownerId: user.id,
          propertyName: booking.property?.hostelName,
          roomName: booking.room?.roomName || booking.room?.roomId,
          dueDate: new Date().toISOString(),
          amount: booking.pricing_breakdown?.totalAmount || 0,
        }),
      });
      if (res.ok) {
        alert("Reminder sent successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send reminder");
      }
    } catch (e: any) {
      alert("Something went wrong");
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  async function fetchBookings() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const role = user.role;
      const params = new URLSearchParams({
        role,
        userEmail: user.email,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(search ? { search } : {}),
      });
      console.log({role, email:user.email});
      
      const res = await fetch(`/api/bookings?${params}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch tenants");
      const data = await res.json();
      console.log(data);
      
      setBookings(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated || !user) {
      router.replace("/login?redirect=/owner/tenants");
      return;
    }
    if (!isOwner && !isAdmin) {
      router.replace("/");
      return;
    }
    fetchBookings();
  }, [authReady, isAuthenticated, user, isOwner, isAdmin, router, statusFilter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchBookings();
  }

  const activeCount = bookings.filter((b) =>
    ["checked-in", "pending"].includes((b.booking_status || "").toLowerCase())
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/10 to-slate-100">
      {earlyCheckoutBooking && (
        <EarlyCheckoutModal
          booking={earlyCheckoutBooking}
          onClose={() => setEarlyCheckoutBooking(null)}
          onSuccess={() => {
            setEarlyCheckoutBooking(null);
            fetchBookings();
          }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.push("/owner")}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Tenants</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {activeCount} active · {bookings.length} total shown
              </p>
            </div>
          </div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by tenant, property, room…"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Search
              </button>
            </form>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              <option value="checked-in,pending">Active (Checked-in + Pending)</option>
              <option value="checked-in">Checked-in Only</option>
              <option value="pending">Pending Only</option>
              <option value="checked-out,completed">Past Tenants</option>
              <option value="">All Statuses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading tenants…</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchBookings} className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold">Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No tenants found for the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <TenantRow
                key={booking.id}
                booking={booking}
                onEarlyCheckout={() => setEarlyCheckoutBooking(booking)}
                onSendReminder={() => handleSendReminder(booking)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TenantRow({
  booking,
  onEarlyCheckout,
  onSendReminder,
}: {
  booking: Booking;
  onEarlyCheckout: () => void;
  onSendReminder: () => void;
}) {
  const [sending, setSending] = useState(false);
  const status = (booking.booking_status || "").toLowerCase();
  const isActive = status === "checked-in" || status === "pending";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isActive ? "border-emerald-200 ring-1 ring-emerald-100" : "border-slate-200"}`}>
      <div className="p-5 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isActive && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Active
              </span>
            )}
            <StatusBadge status={booking.booking_status} />
          </div>
          <p className="font-bold text-slate-900">{booking.tenant_name || booking.tenant_email || "Unknown Tenant"}</p>
          <p className="text-sm text-slate-500 mt-0.5">{booking.tenant_email}</p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          {isActive && (
            <>
              <button
                onClick={async () => {
                  setSending(true);
                  await onSendReminder();
                  setSending(false);
                }}
                disabled={sending}
                className="px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition-colors disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send Reminder"}
              </button>
              <button
                onClick={onEarlyCheckout}
                className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
              >
                Early Checkout
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-5 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 bg-slate-50 border-t border-slate-100 pt-3">
        <InfoCell label="Property" value={booking.property?.hostelName} />
        <InfoCell label="Room" value={booking.room?.roomName || booking.room?.roomId} />
        {booking.room?.bedId && <InfoCell label="Bed" value={`Bed ${booking.room.bedId}`} />}
        <InfoCell label="Check-in" value={fmt(booking.checkIn || booking.booking_details?.checkIn || booking.created_at)} />
        <InfoCell
          label="Check-out"
          value={fmt(
            booking.checkOut ||
            booking.booking_details?.checkOut ||
            booking.booking_details?.actualEndDate
          )}
        />
        <InfoCell label="Booking Code" value={booking.booking_code} mono />
      </div>
    </div>
  );
}

function InfoCell({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold text-slate-800 mt-0.5 truncate ${mono ? "font-mono text-xs" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}
