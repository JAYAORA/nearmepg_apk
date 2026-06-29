"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/data/auth-context";
import { XCircle, Loader2 } from "lucide-react";
import BookingReceipt from "@/components/BookingReceipt";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingProperty {
  hostelId?: string;
  hostelName?: string;
  location?: string;
}

interface BookingRoom {
  roomId?: string;
  roomName?: string;
  bedId?: string | null;
}

interface Booking {
  id: string;
  booking_code?: string;
  booking_status?: string;
  payment_status?: string;
  tenant_id?: string;
  tenant_email?: string;
  property?: BookingProperty;
  room?: BookingRoom;
  booking_details?: Record<string, any>;
  pricing_breakdown?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  checkIn?: string;
  checkOut?: string;
  paid_months?: string[];
  gateway?: Record<string, any>;
  currency?: string;
  hasReviewed?: boolean;
}

interface Payment {
  id: string;
  booking_request_id?: string;
  booking_code?: string;
  amount?: number;
  currency?: string;
  status?: string;
  method?: string;
  payment_type?: string;
  rent_month?: number;
  rent_year?: number;
  payment_date?: string;
  transaction_id?: string;
  comments?: string;
  gateway_order_id?: string;
  gateway_state?: string;
  created_at?: string;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; classes: string }> = {
    "checked-in": {
      label: "Active",
      classes: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    pending: {
      label: "Pending",
      classes: "bg-amber-100 text-amber-700 border-amber-200",
    },
    "checked-out": {
      label: "Completed",
      classes: "bg-slate-100 text-slate-600 border-slate-200",
    },
    cancelled: {
      label: "Cancelled",
      classes: "bg-red-100 text-red-600 border-red-200",
    },
    success: {
      label: "Paid",
      classes: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    initiated: {
      label: "Initiated",
      classes: "bg-blue-100 text-blue-700 border-blue-200",
    },
    failed: {
      label: "Failed",
      classes: "bg-red-100 text-red-600 border-red-200",
    },
    manual: {
      label: "Manual",
      classes: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };
  const s = status?.toLowerCase() ?? "";
  const cfg = map[s] ?? {
    label: status ?? "Unknown",
    classes: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtCurrency(amount?: number, currency = "INR") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function isCurrentBooking(b: Booking) {
  const status = b.booking_status?.toLowerCase();
  return status === "checked-in" || status === "pending";
}

// ─── Payment Card ─────────────────────────────────────────────────────────────

function PaymentCard({ payment }: { payment: Payment }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-800 text-sm capitalize">
            {payment.payment_type === "manual_rent"
              ? `Rent — ${payment.rent_month ? new Date(2000, payment.rent_month - 1).toLocaleString("en-IN", { month: "long" }) : ""} ${payment.rent_year ?? ""}`
              : payment.payment_type === "full"
                ? "Full Payment"
                : (payment.payment_type ?? "Payment")}
          </span>
          <StatusBadge status={payment.status} />
        </div>
        <div className="text-xs text-slate-500 mt-1 space-y-0.5">
          <p>
            Method:{" "}
            <span className="text-slate-700">{payment.method ?? "—"}</span>
          </p>
          {payment.transaction_id && (
            <p>
              Txn ID:{" "}
              <span className="font-mono text-slate-700">
                {payment.transaction_id}
              </span>
            </p>
          )}
          {payment.gateway_order_id && (
            <p>
              Order ID:{" "}
              <span className="font-mono text-slate-700">
                {payment.gateway_order_id}
              </span>
            </p>
          )}
          {payment.payment_date && <p>Date: {fmt(payment.payment_date)}</p>}
          {!payment.payment_date && payment.created_at && (
            <p>Date: {fmt(payment.created_at)}</p>
          )}
          {payment.comments && <p className="italic">"{payment.comments}"</p>}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-base font-bold text-slate-900">
          {fmtCurrency(payment.amount, payment.currency)}
        </p>
      </div>
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  payments,
  onCancelled,
  downloadingId,
  onDownload,
  onReview,
}: {
  booking: Booking;
  payments: Payment[];
  onCancelled: (id: string) => void;
  downloadingId: string | null;
  onDownload: (b: Booking) => void;
  onReview: (b: Booking) => void;
}) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const current = isCurrentBooking(booking);
  // const isPending = booking.booking_status?.toLowerCase() === "pending";
  const totalPaid = payments
    .filter((p) => p.status === "success" || p.status === "successful")
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  async function handleCancel() {
    setCancelling(true);
    setCancelError("");
    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cancelledBy: "tenant",
          reason: cancelReason,
          requesterId: user?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel");
      setShowCancelModal(false);
      onCancelled(booking.id);
    } catch (err: any) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border bg-white shadow-soft overflow-hidden transition-all duration-200 ${current ? "border-emerald-200 ring-1 ring-emerald-100" : "border-slate-200"}`}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {current && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Current Stay
              </span>
            )}
            <StatusBadge status={booking.booking_status} />
            <StatusBadge status={booking.payment_status} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {booking.property?.hostelName ?? "Property"}
          </h3>
          {booking.property?.location && (
            <p className="text-sm text-slate-500 truncate">
              {booking.property.location}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50"
          >
            {expanded ? "Hide" : "View"} Details
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Cancel Booking?
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              This booking at <strong>{booking.property?.hostelName}</strong>{" "}
              will be cancelled. If a refund is applicable, the owner will
              process it.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 mb-4"
            />
            {cancelError && (
              <p className="text-sm text-rose-600 mb-3">{cancelError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Strip */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            Room
          </p>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">
            {booking.room?.roomName ?? booking.room?.roomId ?? "—"}
          </p>
        </div>
        {booking.room?.bedId && (
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Bed
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              Bed {booking.room.bedId}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            Check-in
          </p>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">
            {fmt(booking.checkIn ?? booking.created_at)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            Check-out
          </p>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">
            {fmt(
              booking.checkOut ??
                booking.booking_details?.checkOut ??
                booking.booking_details?.actualEndDate,
            )}
          </p>
        </div>
      </div>

      {/* Action Strip */}
      <div className="bg-slate-50 px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
        {["checked-out", "completed"].includes(
          booking.booking_status?.toLowerCase() ?? "",
        ) &&
          !booking.hasReviewed && (
            <button
              onClick={() => onReview(booking)}
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Leave a Review
            </button>
          )}
        {["confirmed", "checked-in", "checked-out", "completed"].includes(
          booking.booking_status?.toLowerCase() ?? "",
        ) && (
          <button
            onClick={() => onDownload(booking)}
            disabled={downloadingId === booking.id}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
          >
            {downloadingId === booking.id ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
            {downloadingId === booking.id
              ? "Generating..."
              : "Download Receipt"}
          </button>
        )}
        {/* {isPending && ( */}
        {/* <button
            onClick={() => setShowCancelModal(true)}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            Cancel Booking
          </button> */}
        {/* )} */}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 py-5 border-t border-slate-100 space-y-6">
          {/* Booking Details */}
          <section>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Booking Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {booking.booking_code && (
                <InfoRow
                  label="Booking Code"
                  value={
                    <span className="font-mono text-sm font-semibold">
                      {booking.booking_code}
                    </span>
                  }
                />
              )}
              <InfoRow label="Booked On" value={fmt(booking.created_at)} />
              {booking.checkIn && (
                <InfoRow label="Check-in" value={fmt(booking.checkIn)} />
              )}
              {booking.checkOut && (
                <InfoRow label="Check-out" value={fmt(booking.checkOut)} />
              )}
              {booking.booking_details?.months && (
                <InfoRow
                  label="Duration"
                  value={`${booking.booking_details.months} month(s)`}
                />
              )}
              {booking.booking_details?.guests && (
                <InfoRow
                  label="Guests"
                  value={String(booking.booking_details.guests)}
                />
              )}
            </div>
          </section>

          {/* Pricing Breakdown */}
          {booking.pricing_breakdown && (
            <section>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Pricing Breakdown
              </h4>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                {booking.pricing_breakdown.basePrice != null && (
                  <PriceLine
                    label="Base Price"
                    amount={booking.pricing_breakdown.basePrice}
                    currency={booking.currency}
                  />
                )}
                {booking.pricing_breakdown.securityDeposit != null &&
                  booking.pricing_breakdown.securityDeposit > 0 && (
                    <PriceLine
                      label="Security Deposit"
                      amount={booking.pricing_breakdown.securityDeposit}
                      currency={booking.currency}
                    />
                  )}
                {booking.pricing_breakdown.discount != null &&
                  booking.pricing_breakdown.discount > 0 && (
                    <PriceLine
                      label="Discount"
                      amount={-booking.pricing_breakdown.discount}
                      currency={booking.currency}
                      highlight="green"
                    />
                  )}
                {booking.pricing_breakdown.finalAmountPaid != null && (
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <PriceLine
                      label="Total Amount"
                      amount={booking.pricing_breakdown.finalAmountPaid}
                      currency={booking.currency}
                      bold
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Paid Months */}
          {booking.paid_months && booking.paid_months.length > 0 && (
            <section>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Paid Months
              </h4>
              <div className="flex flex-wrap gap-2">
                {booking.paid_months.map((m) => {
                  const [year, month] = m.split("-");
                  const monthName = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                  ).toLocaleString("en-IN", { month: "short" });
                  return (
                    <span
                      key={m}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      {monthName} {year}
                    </span>
                  );
                })}
              </div>
            </section>
          )}

          {/* Payment History */}
          <section>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Payment History
            </h4>
            {payments.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-2">
                No payments recorded yet.
              </p>
            ) : (
              <div className="rounded-xl border border-slate-200 px-4 divide-y divide-slate-100">
                {payments.map((p) => (
                  <PaymentCard key={p.id} payment={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

function PriceLine({
  label,
  amount,
  currency = "INR",
  highlight,
  bold,
}: {
  label: string;
  amount: number;
  currency?: string;
  highlight?: "green";
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${bold ? "font-bold" : ""}`}
    >
      <span className={`text-sm ${bold ? "text-slate-900" : "text-slate-600"}`}>
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${highlight === "green" ? "text-emerald-600" : bold ? "text-slate-900" : "text-slate-800"}`}
      >
        {highlight === "green" && amount < 0 ? "- " : ""}
        {fmtCurrency(Math.abs(amount), currency)}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"current" | "history">("current");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Wait for auth hydration
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated || !user) {
      router.replace("/login?redirect=/account/bookings");
      return;
    }

    async function fetchBookings() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/account/bookings?tenantId=${encodeURIComponent(user!.id)}&email=${encodeURIComponent(user!.email)}`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data.bookings ?? []);
        setPayments(data.payments ?? []);
      } catch (e: any) {
        setError(e.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [authReady, isAuthenticated, user, router]);

  const currentBookings = bookings.filter(isCurrentBooking);
  const pastBookings = bookings.filter((b) => !isCurrentBooking(b));
  const displayed = tab === "current" ? currentBookings : pastBookings;

  function getPaymentsForBooking(bookingId: string) {
    return payments.filter((p) => p.booking_request_id === bookingId);
  }

  // const handleDownloadPDF = async (booking: Booking) => {
  //   try {
  //     setDownloadingId(booking.id);
  //     // @ts-ignore
  //     const html2pdf = (await import("html2pdf.js")).default;
  //     const element = receiptRefs.current[booking.id];
  //     if (!element) throw new Error("Receipt element not found");

  //     element.classList.remove("hidden");
  //     const opt = {
  //       margin:       0.5,
  //       filename:     `Receipt-${booking.booking_code || booking.id}.pdf`,
  //       image:        { type: 'jpeg' as const, quality: 0.98 },
  //       html2canvas:  { scale: 2, useCORS: true },
  //       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as "portrait" | "landscape" | undefined }
  //     };

  //     await html2pdf().set(opt).from(element).save();
  //     element.classList.add("hidden");
  //   } catch (err) {
  //     console.error("PDF generation failed:", err);
  //     alert("Failed to generate PDF. Please try again.");
  //   } finally {
  //     setDownloadingId(null);
  //   }
  // };

  //   const handleDownloadPDF = async (booking: Booking) => {
  //   try {
  //     setDownloadingId(booking.id);

  //     // @ts-ignore
  //     const html2pdf = (await import("html2pdf.js")).default;

  //     const element = receiptRefs.current[booking.id];

  //     if (!element) {
  //       throw new Error("Receipt element not found");
  //     }

  //     // Clone the receipt to avoid html2canvas issues
  //     const clone = element.cloneNode(true) as HTMLElement;

  //     clone.style.position = "fixed";
  //     clone.style.left = "-9999px";
  //     clone.style.top = "0";
  //     clone.style.visibility = "visible";
  //     clone.style.pointerEvents = "none";
  //     clone.style.background = "#ffffff";
  //     clone.style.zIndex = "-1";

  //     document.body.appendChild(clone);

  //     const opt = {
  //       margin: 0.5,
  //       filename: `Receipt-${booking.booking_code || booking.id}.pdf`,
  //       image: {
  //         type: "jpeg" as const,
  //         quality: 0.98,
  //       },
  //       html2canvas: {
  //         scale: 2,
  //         useCORS: true,
  //         backgroundColor: "#ffffff",
  //         logging: false,
  //       },
  //       jsPDF: {
  //         unit: "in",
  //         format: "letter",
  //         orientation: "portrait" as const,
  //       },
  //     };

  //     await html2pdf()
  //       .set(opt)
  //       .from(clone)
  //       .save();

  //     document.body.removeChild(clone);
  //   } catch (err) {
  //     console.error("PDF generation failed:", err);
  //     alert("Failed to generate PDF. Please try again.");
  //   } finally {
  //     setDownloadingId(null);
  //   }
  // };

  // const handleDownloadPDF = async (booking: Booking) => {
  //   try {
  //     setDownloadingId(booking.id);

  //     // inject safe CSS overrides (fixes oklch/lab issue)
  //     injectPdfCssFix();

  //     // @ts-ignore
  //     const html2pdf = (await import("html2pdf.js")).default;

  //     const element = receiptRefs.current[booking.id];

  //     if (!element) {
  //       throw new Error("Receipt element not found");
  //     }

  //     // clone element to avoid DOM interference
  //     // const clone = element.cloneNode(true) as HTMLElement;

  //     // clone.style.position = "fixed";
  //     // clone.style.left = "-99999px";
  //     // clone.style.top = "0";
  //     // clone.style.background = "#ffffff";
  //     // clone.style.color = "#0f172a";

  //     // document.body.appendChild(clone);
  //     // clone element to avoid DOM interference
  //     // If 'element' is the hidden wrapper, grab the inner receipt box instead
  //     const contentToClone = element.firstElementChild || element;
  //     const clone = contentToClone.cloneNode(true) as HTMLElement;
  //     // const clone = element.cloneNode(true) as HTMLElement;

  //     // FIXES: Force visibility, block status, and layout styling
  //     clone.style.display = "block"; // Ensure it's not display: none
  //     clone.style.visibility = "visible"; // Override the visibility: hidden from the parent wrapper
  //     clone.style.position = "fixed";
  //     clone.style.left = "-99999px";
  //     clone.style.top = "0";
  //     clone.style.width = "794px"; // Match the targeted look width
  //     clone.style.background = "#ffffff";
  //     clone.style.color = "#0f172a";

  //     document.body.appendChild(clone);

  //     const opt = {
  //       margin: 0.5,
  //       filename: `Receipt-${booking.booking_code || booking.id}.pdf`,
  //       image: {
  //         type: "jpeg" as const,
  //         quality: 0.98,
  //       },
  //       html2canvas: {
  //         scale: 2,
  //         useCORS: true,
  //         backgroundColor: "#ffffff",
  //         logging: false,
  //       },
  //       jsPDF: {
  //         unit: "in",
  //         format: "letter",
  //         orientation: "portrait" as const,
  //       },
  //     };

  //     await html2pdf().set(opt).from(clone).save();

  //     document.body.removeChild(clone);

  //     // remove temporary fix
  //     removePdfCssFix();
  //   } catch (err) {
  //     console.error("PDF generation failed:", err);
  //     alert("Failed to generate PDF. Please try again.");
  //   } finally {
  //     setDownloadingId(null);
  //   }
  // };

  const handleDownloadPDF = async (booking: Booking) => {
    try {
      setDownloadingId(booking.id);

      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(<BookingReceipt booking={booking} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Receipt-${booking.booking_code || booking.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const submitReview = async () => {
    if (!reviewBooking || !user) return;
    setSubmittingReview(true);
    setReviewError("");
    try {
      const res = await fetch(
        `/api/properties/${reviewBooking.property?.hostelId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name || "Tenant",
            rating: reviewRating,
            comment: reviewComment,
            bookingId: reviewBooking.id,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      // Update local state to hide the review button
      setBookings((prev) =>
        prev.map((b) =>
          b.id === reviewBooking.id ? { ...b, hasReviewed: true } : b,
        ),
      );
      setReviewBooking(null);
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!authReady || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="h-8 w-48 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-5 w-72 rounded-lg bg-slate-100 animate-pulse" />
          <div className="flex gap-2 mt-6">
            <div className="h-10 w-28 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-10 w-28 rounded-xl bg-slate-100 animate-pulse" />
          </div>
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white shadow-soft overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="h-5 w-40 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-4 w-56 rounded-lg bg-slate-100 animate-pulse" />
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="h-8 rounded-lg bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50">
      {/* Hero strip */}
      <div className="bg-white border-b border-slate-100 shadow-soft">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-warm">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                My Bookings
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                View your current stay, past bookings, and full payment history
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setTab("current")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === "current"
                  ? "bg-orange-500 text-white shadow-warm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Current
              {currentBookings.length > 0 && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${tab === "current" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"}`}
                >
                  {currentBookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === "history"
                  ? "bg-orange-500 text-white shadow-warm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              History
              {pastBookings.length > 0 && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${tab === "history" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {pastBookings.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-10 h-10 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-2">
              {tab === "current" ? "No active bookings" : "No past bookings"}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {tab === "current"
                ? "You don't have any active stays right now."
                : "Your completed bookings will appear here."}
            </p>
            {tab === "current" && (
              <a
                href="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm shadow-warm"
              >
                Browse Properties
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            )}
          </div>
        ) : (
          displayed.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              payments={getPaymentsForBooking(b.id)}
              onCancelled={(id) =>
                setBookings((prev) =>
                  prev.map((item) =>
                    item.id === id
                      ? { ...item, booking_status: "cancelled" }
                      : item,
                  ),
                )
              }
              downloadingId={downloadingId}
              onDownload={handleDownloadPDF}
              onReview={setReviewBooking}
            />
          ))
        )}
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setReviewBooking(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Rate your stay
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              How was your experience at {reviewBooking.property?.hostelName}?
            </p>

            {/* Star Rating */}
            <div className="flex gap-2 mb-6 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={`transition-colors p-1 ${star <= reviewRating ? "text-amber-400" : "text-slate-200 hover:text-amber-200"}`}
                >
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Tell us about your experience (optional)"
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 mb-4 bg-slate-50"
            />

            {reviewError && (
              <p className="text-sm text-rose-600 mb-4 text-center">
                {reviewError}
              </p>
            )}

            <button
              onClick={submitReview}
              disabled={submittingReview}
              className="w-full py-3.5 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submittingReview ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : null}
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
