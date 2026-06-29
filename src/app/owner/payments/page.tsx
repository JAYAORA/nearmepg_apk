"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { useAuth, useIsOwner, useIsAdmin } from "@/data/auth-context";

interface Payment {
  id: string;
  tenantName: string;
  tenantEmail: string;
  propertyName: string;
  roomName: string;
  amount: number;
  status: string;
  bookingStatus: string;
  date: string;
  refundStatus: string | null;
  bookingCode: string;
}

export default function OwnerPaymentsPage() {
  const { user, isAuthenticated } = useAuth();
  const isOwner = useIsOwner();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/owner/payments?email=${encodeURIComponent(user!.email)}&role=${user!.role}`);
      if (!res.ok) throw new Error("Failed to load payments");
      setPayments(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated || !user) {
      router.replace("/login?redirect=/owner/payments");
      return;
    }
    if (!isOwner && !isAdmin) {
      router.replace("/");
      return;
    }
    loadPayments();
  }, [authReady, isAuthenticated, user, isOwner, isAdmin, router]);

  async function handleMarkRefunded(id: string) {
    if (!confirm("Are you sure you want to mark this booking as refunded? This indicates you have successfully processed the refund offline.")) return;

    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refundMethod: "offline", refundNote: "Processed by owner" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to mark as refunded");
      
      alert("Successfully marked as refunded.");
      loadPayments();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (!authReady || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading payment history…</p>
        </div>
      </div>
    );
  }

  const successCount = payments.filter(p => p.status === "success").length;
  const pendingRefunds = payments.filter(p => p.refundStatus === "pending_owner_action").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
            <Link href="/owner" className="hover:text-amber-600 transition-colors">Owner Dashboard</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Payments</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment History</h1>
              <p className="text-sm text-slate-500 mt-1">Track transactions and process refunds</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Successful</p>
                <p className="text-lg font-bold text-emerald-900">{successCount}</p>
              </div>
              <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide">Pending Refunds</p>
                <p className="text-lg font-bold text-rose-900">{pendingRefunds}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No payment history found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wide text-xs">Date</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wide text-xs">Details</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wide text-xs">Amount</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wide text-xs">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wide text-xs text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {new Date(p.date).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{p.tenantName}</p>
                        <p className="text-xs text-slate-500">{p.propertyName} · {p.roomName}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.bookingCode}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {formatINR(p.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.refundStatus === "pending_owner_action" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                            Refund Required
                          </span>
                        ) : p.refundStatus === "refunded" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Refunded
                          </span>
                        ) : p.status === "success" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                            {p.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.refundStatus === "pending_owner_action" && (
                          <button
                            onClick={() => handleMarkRefunded(p.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-600 text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            Mark Refunded
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
