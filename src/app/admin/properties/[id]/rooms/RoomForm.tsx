"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Settings,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { adminAssignTenant } from "@/lib/admin-api";
import type { RoomPayload, BedPayload } from "@/lib/admin-api";

// ── Helpers ──────────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
      {...props}
    />
  );
}

function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none"
      {...props}
    >
      {children}
    </select>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      {message}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  available: "bg-emerald-50 border-emerald-200 text-emerald-800",
  reserved:  "bg-yellow-50 border-yellow-200 text-yellow-800",
  occupied:  "bg-red-50 border-red-200 text-red-700",
};

const STEPS = [
  { id: 1, label: "Basic Info",  icon: Settings },
  { id: 2, label: "Media",       icon: ImageIcon },
  { id: 3, label: "Beds & Booking", icon: BedDouble },
];

interface Props {
  hostelSlug: string;
  propertyId: string;
  roomFirestoreId?: string;
  propertyType?: "pg" | "hotel" | "coliving";
  initialData?: Partial<RoomPayload & { firestoreId?: string }>;
  onSubmit: (payload: RoomPayload) => Promise<any>;
}

type ManualBookingDetails = {
  tenantEmail: string;
  checkIn: string;
  checkOut: string;
  paymentAmount: string;
  paymentMethod: string;
  paymentDate: string;
  upiId: string;
};

const defaultBookingDetails = (): ManualBookingDetails => ({
  tenantEmail: "",
  checkIn: new Date().toISOString().split('T')[0],
  checkOut: "",
  paymentAmount: "",
  paymentMethod: "Manual/Cash",
  paymentDate: new Date().toISOString().split('T')[0],
  upiId: "",
});

export default function RoomForm({
  hostelSlug,
  propertyId,
  roomFirestoreId,
  initialData,
  propertyType,
  onSubmit,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isHotel = propertyType === "hotel";

  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Step 1: Basic Info ────────────────────────────────────────────────────
  const [roomId, setRoomId] = useState(initialData?.id ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [price, setPrice] = useState<number>(initialData?.price ?? 0);
  const [perDayPrice, setPerDayPrice] = useState<number>(initialData?.per_day_price ?? 0);
  const [hasAC, setHasAC] = useState(initialData?.hasAC ?? false);
  const [available, setAvailable] = useState(initialData?.available ?? true);
  const [floor, setFloor] = useState<string>(initialData?.floor != null ? String(initialData.floor) : "");
  const [minStay, setMinStay] = useState<number>(initialData?.mandatory_min_stay ?? 0);
  const [panoramaUrl, setPanoramaUrl] = useState(initialData?.panoramaUrl ?? "");

  // ── Step 2: Images ────────────────────────────────────────────────────────
  const [images, setImages] = useState<string[]>(initialData?.images?.length ? initialData.images : [""]);
  const addImageRow = () => setImages((p) => [...p, ""]);
  const removeImageRow = (i: number) => setImages((p) => p.filter((_, idx) => idx !== i));
  const updateImageRow = (i: number, v: string) => setImages((p) => p.map((u, idx) => (idx === i ? v : u)));

  // ── Step 3: Beds ──────────────────────────────────────────────────────────
  const [hotelSharing, setHotelSharing] = useState<number>(initialData?.sharing || 2);
  const [beds, setBeds] = useState<BedPayload[]>(
    initialData?.beds?.length
      ? initialData.beds
      : Array.from({ length: initialData?.sharing || 2 }, (_, i) => ({
          id: String(i + 1),
          label: `Bed ${i + 1}`,
          status: "available" as const,
        }))
  );

  const [manualBookings, setManualBookings] = useState<Record<string, ManualBookingDetails>>({});
  const [roomBooking, setRoomBooking] = useState<ManualBookingDetails>(defaultBookingDetails());

  const updateBed = (i: number, field: keyof BedPayload, value: string | number | undefined | null) =>
    setBeds((prev) => prev.map((b, idx) => (idx === i ? { ...b, [field]: value } : b)));

  const addBed = () => {
    setBeds((prev) => [
      ...prev,
      { id: String(prev.length + 1), label: `Bed ${prev.length + 1}`, status: "available" },
    ]);
  };

  const removeBed = (i: number) => {
    if (beds[i].status === "occupied") return; // guard
    setBeds((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateManualBooking = (bedId: string, field: keyof ManualBookingDetails, value: string) => {
    setManualBookings((prev) => ({
      ...prev,
      [bedId]: {
        ...(prev[bedId] || defaultBookingDetails()),
        [field]: value,
      },
    }));
  };

  const updateRoomBooking = (field: keyof ManualBookingDetails, value: string) => {
    setRoomBooking((prev) => ({ ...prev, [field]: value }));
  };

  // ── Step validation ───────────────────────────────────────────────────────
  const canProceed = () => {
    if (step === 1) return (!roomFirestoreId ? roomId.trim().length >= 1 : true) && price > 0;
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    setSubmitError(null);

    const newlyOccupiedBeds = beds.filter(bed => {
      if (bed.status !== "occupied") return false;
      const wasOccupied = initialData?.beds?.find(b => b.id === bed.id)?.status === "occupied";
      return !wasOccupied;
    });

    for (const bed of newlyOccupiedBeds) {
      const details = manualBookings[bed.id];
      if (!details?.tenantEmail?.trim()) {
        setSubmitError(`Tenant email is required for newly occupied bed: ${bed.label || bed.id}`);
        return;
      }
      if (!details?.checkIn) {
        setSubmitError(`Check-In date is required for newly occupied bed: ${bed.label || bed.id}`);
        return;
      }
    }

    const isRoomNewlyOccupied = beds.length === 0 && !available && (initialData?.available !== false);
    if (isRoomNewlyOccupied) {
      if (!roomBooking.tenantEmail.trim()) {
        setSubmitError("Tenant email is required when marking a full room as occupied.");
        return;
      }
      if (!roomBooking.checkIn) {
        setSubmitError("Check-In date is required when marking a full room as occupied.");
        return;
      }
    }

    const payload: RoomPayload = {
      id: roomId || initialData?.id || "",
      hostel_slug: hostelSlug,
      name: name || undefined,
      price,
      per_day_price: perDayPrice,
      sharing: isHotel ? hotelSharing : beds.length,
      hasAC,
      available,
      floor: floor !== "" ? Number(floor) : undefined,
      mandatory_min_stay: isHotel ? undefined : minStay,
      images: images.filter((u) => u.trim()),
      panoramaUrl: panoramaUrl.trim() || undefined,
      beds: isHotel ? [] : beds,
    };

    const newlyFreedBeds = (initialData?.beds || []).filter(
      b => b.status === "occupied" && beds.find(nb => nb.id === b.id)?.status === "available"
    );
    const isRoomNewlyFreed = initialData?.available === false && available === true;

    startTransition(async () => {
      try {
        // 1. Process early checkouts FIRST to ensure bookings and user profiles are updated.
        // The early-checkout API also marks the bed as available in Firestore, but our
        // onSubmit will do a full overwrite anyway, which is fine.
        if (newlyFreedBeds.length > 0) {
          for (const freedBed of newlyFreedBeds) {
            if (freedBed.bookingId) {
              await fetch(`/api/bookings/${freedBed.bookingId}/early-checkout`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: "Admin manually freed the bed" })
              });
            }
          }
        }

        if (isRoomNewlyFreed && initialData?.roomBookingId) {
          await fetch(`/api/bookings/${initialData.roomBookingId}/early-checkout`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: "Admin manually freed the room" })
          });
        }

        const result = await onSubmit(payload);
        const finalFirestoreId = roomFirestoreId || (result && result.firestoreId);
        
        if (finalFirestoreId && newlyOccupiedBeds.length > 0) {
          for (const bed of newlyOccupiedBeds) {
             const details = manualBookings[bed.id] || defaultBookingDetails();
             await adminAssignTenant(finalFirestoreId, {
               propertyId,
               propertyName: "Manual Admin Assignment",
               bedId: bed.id,
               tenantEmail: details.tenantEmail.trim(),
               checkIn: details.checkIn,
               checkOut: details.checkOut || undefined,
               paymentMethod: details.paymentMethod,
               paymentAmount: details.paymentAmount ? Number(details.paymentAmount) : 0,
               paymentDate: details.paymentDate,
               upiId: details.upiId || undefined,
             });
          }
        }

        if (finalFirestoreId && isRoomNewlyOccupied) {
          await adminAssignTenant(finalFirestoreId, {
            propertyId,
            propertyName: "Manual Admin Assignment",
            tenantEmail: roomBooking.tenantEmail.trim(),
            checkIn: roomBooking.checkIn,
            checkOut: roomBooking.checkOut || undefined,
            paymentMethod: roomBooking.paymentMethod,
            paymentAmount: roomBooking.paymentAmount ? Number(roomBooking.paymentAmount) : 0,
            paymentDate: roomBooking.paymentDate,
            upiId: roomBooking.upiId || undefined,
          });
        }
        
        router.push(`/admin/properties/${propertyId}/rooms`);
      } catch (err: any) {
        setSubmitError(err.message ?? "Something went wrong");
      }
    });
  };

  // ── Tenant Verification ───────────────────────────────────────────────────
  const [verificationStatus, setVerificationStatus] = useState<Record<string, { status: "loading" | "success" | "error" | null; message: string }>>({});

  const verifyTenant = async (id: string, email: string) => {
    if (!email) return;
    setVerificationStatus((prev) => ({ ...prev, [id]: { status: "loading", message: "Verifying..." } }));
    try {
      const res = await fetch(`/api/admin/users/verify?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      
      if (data.exists) {
        setVerificationStatus((prev) => ({ 
          ...prev, 
          [id]: { status: "success", message: `Verified: ${data.name} (${data.role})` } 
        }));
      } else {
        setVerificationStatus((prev) => ({ 
          ...prev, 
          [id]: { status: "error", message: "User not found. They must register first." } 
        }));
      }
    } catch (err: any) {
      setVerificationStatus((prev) => ({ 
        ...prev, 
        [id]: { status: "error", message: err.message } 
      }));
    }
  };

  // ── Sub-component for Manual Booking Form ─────────────────────────────────
  const renderManualBookingForm = (
    id: string,
    details: ManualBookingDetails,
    updater: (field: keyof ManualBookingDetails, val: string) => void
  ) => {
    const vStatus = verificationStatus[id];
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 mt-3 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-1 bg-amber-500 rounded-full"></div>
          <h4 className="font-bold text-slate-800 text-sm">Manual Booking Details</h4>
        </div>
        
        <div>
          <Label required>Tenant Email (Must be registered)</Label>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="tenant@example.com"
              value={details.tenantEmail}
              onChange={(e) => {
                updater("tenantEmail", e.target.value);
                setVerificationStatus((prev) => ({ ...prev, [id]: { status: null, message: "" } }));
              }}
            />
            <button
              type="button"
              disabled={!details.tenantEmail || vStatus?.status === "loading"}
              onClick={() => verifyTenant(id, details.tenantEmail)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {vStatus?.status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
            </button>
          </div>
          {vStatus?.message && (
            <p className={`mt-1.5 text-xs font-medium ${vStatus.status === "success" ? "text-emerald-600" : "text-rose-600"}`}>
              {vStatus.status === "success" ? <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" /> : <AlertCircle className="h-3.5 w-3.5 inline mr-1" />}
              {vStatus.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label required>Check-In Date</Label>
            <Input
              type="date"
              value={details.checkIn}
              onChange={(e) => updater("checkIn", e.target.value)}
            />
          </div>
          <div>
            <Label>Check-Out Date</Label>
            <Input
              type="date"
              value={details.checkOut}
              onChange={(e) => updater("checkOut", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
          <div>
            <Label>Amount Paid (₹)</Label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={details.paymentAmount}
              onChange={(e) => updater("paymentAmount", e.target.value)}
            />
          </div>
          <div>
            <Label>Payment Method</Label>
            <Select
              value={details.paymentMethod}
              onChange={(e) => updater("paymentMethod", e.target.value)}
            >
              <option value="Manual/Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card/POS</option>
            </Select>
          </div>
        </div>

        {details.paymentMethod === "UPI" && (
          <div>
            <Label>UPI ID / Txn Ref</Label>
            <Input
              type="text"
              placeholder="e.g. 1234567890@ybl or Txn ID"
              value={details.upiId}
              onChange={(e) => updater("upiId", e.target.value)}
            />
          </div>
        )}

        <div>
          <Label>Payment Date</Label>
          <Input
            type="date"
            value={details.paymentDate}
            onChange={(e) => updater("paymentDate", e.target.value)}
          />
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      {/* Step bar */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = step === s.id;
          const done = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => done && setStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-amber-600 text-white shadow-warm"
                    : done
                    ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-400 cursor-default"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 transition-colors ${
                    done ? "bg-emerald-300" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-5">
        {/* ── Step 1: Basic Info ─────────────────────────────────────────── */}
        {step === 1 && (
          <>
            <h2 className="font-display text-lg font-bold text-slate-900">Room Details</h2>

            {/* Room ID — only on create */}
            {!roomFirestoreId && (
              <div>
                <Label required>Room ID</Label>
                <Input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                  placeholder="e.g. r1, room-101, deluxe-1"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Unique identifier within this property. Alphanumeric, hyphens and underscores only.
                </p>
              </div>
            )}

            <div>
              <Label>Display Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Deluxe Double, 3-Sharing Ground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>{isHotel ? "Price per Night (₹)" : "Monthly Price (₹)"}</Label>
                <Input
                  type="number"
                  min={1}
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder={isHotel ? "2000" : "8000"}
                />
              </div>
              {!isHotel && (
                <div>
                  <Label>Per Day Price (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={perDayPrice || ""}
                    onChange={(e) => setPerDayPrice(Number(e.target.value))}
                    placeholder="400"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Floor</Label>
                <Input
                  type="number"
                  min={0}
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="0 = Ground"
                />
              </div>
              {!isHotel && (
                <div>
                  <Label>Min Stay (months)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={minStay || ""}
                    onChange={(e) => setMinStay(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Toggle checked={hasAC} onChange={setHasAC} label="Air Conditioned (AC)" />
              <Toggle
                checked={available}
                onChange={(val) => {
                  if (initialData?.available === false && val === true) {
                    const confirmed = window.confirm("Changing this room to available will check out the current tenant early. Proceed?");
                    if (!confirmed) return;
                  }
                  setAvailable(val);
                }}
                label="Room is bookable / available"
              />
              {!available && beds.length === 0 && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-3">
                  {initialData?.available === false ? (
                    <div>
                      <p className="text-sm font-medium text-amber-600 mb-1">
                        ⚠️ This room is currently marked as unavailable/occupied.
                      </p>
                      {initialData?.roomTenantEmail && (
                        <p className="text-sm font-semibold text-slate-800">
                          Occupied by: {initialData.roomTenantEmail}
                        </p>
                      )}
                    </div>
                  ) : (
                    renderManualBookingForm("room", roomBooking, updateRoomBooking)
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Step 2: Media ──────────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Images
              <span className="ml-2 text-sm font-normal text-slate-400">(URLs only)</span>
            </h2>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Gallery Images</Label>
                <button
                  type="button"
                  onClick={addImageRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Image
                </button>
              </div>
              <div className="space-y-2.5">
                {images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => updateImageRow(i, e.target.value)}
                      placeholder={`https://example.com/room-photo-${i + 1}.jpg`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageRow(i)}
                      disabled={images.length === 1}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>360° Panorama URL</Label>
              <Input
                type="url"
                value={panoramaUrl}
                onChange={(e) => setPanoramaUrl(e.target.value)}
                placeholder="https://example.com/panorama.jpg"
              />
              <p className="mt-1 text-xs text-slate-400">
                Equirectangular image for the 360° viewer (optional)
              </p>
            </div>

            {images[0] && (
              <div className="rounded-xl overflow-hidden h-40 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[0]}
                  alt="Room preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* ── Step 3: Beds ───────────────────────────────────────────────── */}
        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">{isHotel ? "Room Occupancy & Review" : "Beds"}</h2>
              {!isHotel && (
                <button
                  type="button"
                  onClick={addBed}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed bg-amber-50 px-3 py-1.5 rounded-full"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Bed
                </button>
              )}
            </div>

            {isHotel ? (
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-400">
                  Set the maximum number of guests allowed to stay in this room.
                </p>
                <div>
                  <Label>Sharing Capacity / Occupancy</Label>
                  <Select
                    value={hotelSharing}
                    onChange={(e) => setHotelSharing(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 -mt-2">
                  The number of beds here determines the room's total sharing capacity.
                </p>
                <div className="space-y-4">
              {beds.map((bed, i) => {
                const isOccupied = bed.status === "occupied";
                const wasOccupied = initialData?.beds?.find(b => b.id === bed.id)?.status === "occupied";
                
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border p-4 ${STATUS_STYLE[bed.status] ?? "border-slate-200"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Bed {i + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <Select
                          value={bed.status}
                          onChange={(e) => {
                            if (wasOccupied && e.target.value === "available") {
                              const confirmed = window.confirm("Changing this bed to AVAILABLE will checkout the current tenant early when you save. Do you want to proceed?");
                              if (!confirmed) return;
                            }
                            updateBed(i, "status", e.target.value);
                          }}
                          className={`py-1! px-2! pr-8! text-xs font-bold uppercase rounded-full border ${STATUS_STYLE[bed.status]}`}
                        >
                          <option value="available">AVAILABLE</option>
                          <option value="reserved">RESERVED</option>
                          <option value="occupied">OCCUPIED</option>
                        </Select>
                        <button
                          type="button"
                          onClick={() => removeBed(i)}
                          disabled={wasOccupied}
                          title={wasOccupied ? "Cannot remove already occupied bed" : "Remove bed"}
                          className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Bed ID</Label>
                        <Input
                          value={bed.id}
                          onChange={(e) => updateBed(i, "id", e.target.value)}
                          placeholder="1, A, top-bunk"
                        />
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={bed.label ?? ""}
                          onChange={(e) => updateBed(i, "label", e.target.value)}
                          placeholder="Bed A, Top Bunk…"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <Label>Yaw (360° View)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={bed.yaw ?? ""}
                          onChange={(e) => updateBed(i, "yaw", e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <Label>Pitch (360° View)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={bed.pitch ?? ""}
                          onChange={(e) => updateBed(i, "pitch", e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                    {isOccupied && (
                      <div className="mt-3">
                        {!wasOccupied ? (
                          renderManualBookingForm(
                            bed.id,
                            manualBookings[bed.id] || defaultBookingDetails(),
                            (field, val) => updateManualBooking(bed.id, field, val)
                          )
                        ) : (
                          <div>
                            <p className="mt-2 text-xs text-amber-600 font-medium mb-1">
                              ⚠️ This bed is currently occupied.
                            </p>
                            {initialData?.beds?.find(b => b.id === bed.id)?.tenantEmail && (
                              <p className="text-sm font-semibold text-slate-800">
                                Occupied by: {initialData.beds.find(b => b.id === bed.id)?.tenantEmail}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
              </>
            )}

            {/* Review summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-1.5">
              <p className="font-semibold text-slate-700 mb-2">Review</p>
              <div className="grid grid-cols-2 gap-1 text-slate-500">
                <span>Room ID:</span>     <span className="font-medium text-slate-800">{roomId || initialData?.id}</span>
                <span>Name:</span>        <span className="font-medium text-slate-800">{name || "—"}</span>
                <span>Price:</span>       <span className="font-medium text-slate-800">₹{price}/{isHotel ? "night" : "mo"}</span>
                <span>Sharing:</span>     <span className="font-medium text-slate-800">{isHotel ? hotelSharing : beds.length} persons</span>
                <span>AC:</span>          <span className="font-medium text-slate-800">{hasAC ? "Yes" : "No"}</span>
                {!isHotel && <span>Beds:</span>}        {!isHotel && <span className="font-medium text-slate-800">{beds.length}</span>}
                <span>Images:</span>      <span className="font-medium text-slate-800">{images.filter(u => u).length}</span>
              </div>
            </div>

            {submitError && <FormError message={submitError} />}
          </>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => step > 1 && setStep((s) => s - 1)}
          disabled={step === 1}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {step < STEPS.length ? (
          <button
            type="button"
            disabled={!canProceed()}
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-warm"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {roomFirestoreId ? "Saving…" : "Creating…"}
              </>
            ) : (
              <>{roomFirestoreId ? "Save Changes" : "Create Room"}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
