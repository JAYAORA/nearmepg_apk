"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ScanEye,
  Snowflake,
  Fan,
  Users,
  Star,
  BedDouble,
  CheckCircle,
  XCircle,
  HourglassIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { formatINR } from "@/lib/utils";
import type { Room } from "@/types/property";
import { addDays, isSameDay } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomDetailsModalProps {
  room: Room | null;
  propertySlug: string;
  isPg: boolean;
  selectedBeds: number[];
  onBedSelect: (bedId: number, status: string, roomId: string) => void;
  on360: (room: Room) => void;
  onClose: () => void;
}

// ─── Gallery Sub-component ────────────────────────────────────────────────────

function RoomGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative">
      {/* Main image */}
      <div className="relative h-64 sm:h-80 bg-slate-100 rounded-2xl overflow-hidden">
        <Image
          src={images[activeIdx]}
          alt={`${name} — photo ${activeIdx + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, 700px"
          className="object-cover"
          priority
        />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-semibold">
              {activeIdx + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Photo ${i + 1}`}
              className={`relative w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIdx
                  ? "border-amber-500"
                  : "border-transparent hover:border-amber-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Amenity chip ─────────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, string> = {
  WiFi: "📶", AC: "❄️", TV: "📺", Safe: "🔐", "Mini Fridge": "🧊",
  "Mini Bar": "🍾", Desk: "💼", Bathrobe: "🛁", Jacuzzi: "♨️",
  Balcony: "🌆", "Butler Service": "🎩", "Private Dining": "🍽️",
  Concierge: "🛎️", Breakfast: "☕",
};

function AmenityChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
      <span>{AMENITY_ICONS[label] ?? "✓"}</span>
      {label}
    </span>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function RoomDetailsModal({
  room,
  propertySlug,
  isPg,
  selectedBeds,
  onBedSelect,
  on360,
  onClose,
}: RoomDetailsModalProps) {
  const [disabledDates, setDisabledDates] = React.useState<{ start: Date; end: Date }[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  React.useEffect(() => {
    if (!room || isPg) return;
    
    let isMounted = true;
    const fetchBlockedDates = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/property-rooms/${room.firestoreId || room.id}/blocked-dates`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.blockedDates) {
            setDisabledDates(data.blockedDates.map((d: any) => ({
              start: new Date(d.start),
              end: new Date(d.end)
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch blocked dates:", err);
      }
    };
    fetchBlockedDates();
    return () => { isMounted = false; };
  }, [room, isPg]);

  if (!room) return null;

  // Extra hotel-specific fields stored as spread properties
  const extra = room as any;
  const description: string | undefined = extra.description;
  const maxGuests: number | undefined = extra.maxGuests;
  const bedType: string | undefined = extra.bedType;
  const roomAmenities: string[] | undefined = extra.amenities;

  const availableBeds = room.beds?.filter((b) => b.status === "available").length ?? 0;
  const totalBeds = room.beds?.length ?? 0;

  const isRoomBooked = !isPg && !room.available;
  const selectedInRoom = room.beds?.some((b) =>
    selectedBeds.includes(Number(b.id))
  );

  // Real dates are fetched and stored in disabledDates
  // We need to convert them to an array of dates to pass to Calendar's disabled prop if needed, 
  // or pass a custom function like in DateRangePicker
  const isDateDisabled = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return true;

    return disabledDates.some((range) => {
      const checkDate = new Date(day);
      checkDate.setHours(0, 0, 0, 0);
      const rStart = new Date(range.start);
      rStart.setHours(0, 0, 0, 0);
      const rEnd = new Date(range.end);
      rEnd.setHours(0, 0, 0, 0);
      return checkDate >= rStart && checkDate <= rEnd;
    });
  };

  const handleSelect = (newDate: DateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      // Prevent selecting a range that contains disabled dates
      const current = new Date(newDate.from);
      current.setHours(0, 0, 0, 0);
      const toDate = new Date(newDate.to);
      toDate.setHours(0, 0, 0, 0);

      let hasDisabled = false;
      while (current <= toDate) {
        if (isDateDisabled(current)) {
          hasDisabled = true;
          break;
        }
        current.setDate(current.getDate() + 1);
      }

      if (hasDisabled) {
        setDateRange({ from: newDate.from, to: undefined });
        return;
      }
    }
    setDateRange(newDate);
  };

  return (
    <Dialog open={!!room} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-11/12 md:w-full max-w-sm md:max-w-4xl max-h-[92vh] overflow-y-auto p-0 rounded-sm border-0 shadow-2xl scrollbar-thin"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          Room details for {room.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Room details for {room.name}
        </DialogDescription>

        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-5 py-3.5">
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-tight">
              {room.name ?? (isPg ? `${room.sharing}-Sharing Room` : "Room Details")}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPg ? `Floor ${room.floor ?? "—"} · ${room.sharing}-sharing` : `Floor ${room.floor ?? "—"} · Up to ${maxGuests ?? room.sharing} guests`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close room details"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="size-4 text-slate-600" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* ── Gallery ── */}
          <RoomGallery
            images={room.images ?? []}
            name={room.name ?? "Room"}
          />

          {/* ── Quick info chips ── */}
          <div className="flex flex-wrap gap-2">
            {room.hasAC ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                <Snowflake className="size-3.5" /> Air Conditioned
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                <Fan className="size-3.5" /> Non-AC
              </span>
            )}

            {isPg ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                <Users className="size-3.5" /> {room.sharing}-Sharing
              </span>
            ) : (
              <>
                {bedType && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                    <BedDouble className="size-3.5" /> {bedType} Bed
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <Users className="size-3.5" /> Up to {maxGuests ?? room.sharing} guests
                </span>
              </>
            )}

            {room.floor != null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                Floor {room.floor}
              </span>
            )}

            {!isPg && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  room.available
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {room.available ? "✓ Available" : "✗ Sold Out"}
              </span>
            )}
          </div>

          {/* ── Description ── */}
          {description && (
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
          )}

          {/* ── Room amenities ── */}
          {roomAmenities && roomAmenities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">In this room</h3>
              <div className="flex flex-wrap gap-2">
                {roomAmenities.map((a) => (
                  <AmenityChip key={a} label={a} />
                ))}
              </div>
            </div>
          )}

          {/* ── Bed grid (PG only) ── */}
          {isPg && room.beds && room.beds.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">Select a Bed</h3>
                <span className="text-xs text-slate-400">
                  {availableBeds}/{totalBeds} available
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {room.beds.map((bed) => {
                  const bedId = Number(bed.id);
                  const isSelected = selectedBeds.includes(bedId);
                  const isAvail = bed.status === "available";
                  const isRes = bed.status === "reserved";

                  return (
                    <button
                      key={bed.id}
                      disabled={!isAvail}
                      onClick={() => onBedSelect(bedId, bed.status, room.id)}
                      className={`relative p-3.5 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        isAvail
                          ? isSelected
                            ? "border-amber-500 bg-amber-50 text-amber-800"
                            : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-amber-400 cursor-pointer"
                          : isRes
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700 cursor-not-allowed"
                          : "border-red-200 bg-red-50 text-red-700 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{bed.label ? String(bed.label) : `Bed ${bed.id}`}</span>
                        {isAvail && isSelected && <CheckCircle className="size-4 text-amber-600" />}
                        {isAvail && !isSelected && <CheckCircle className="size-4 text-emerald-500" />}
                        {isRes && <HourglassIcon className="size-4" />}
                        {!isAvail && !isRes && <XCircle className="size-4" />}
                      </div>
                      <div className="mt-1 text-xs opacity-80 capitalize">{bed.status}</div>
                    </button>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />Available</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" />Reserved</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />Occupied</span>
              </div>
            </div>
          )}

          {/* ── Availability Calendar (Hotel only) ── */}
          {!isPg && (
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">Select your Stay Dates</h3>
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 flex flex-col items-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleSelect}
                  disabled={isDateDisabled}
                  numberOfMonths={1}
                  className="rounded-xl border border-slate-200 p-3 bg-white mx-auto shadow-sm"
                />
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                  <div className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-300 opacity-50"></div>
                  <span>Sold Out / Unavailable</span>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-slate-200 bg-white" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-200" /> Booked
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Price + CTAs ── */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-3xl font-bold text-slate-900">{formatINR(room.price)}</span>
              <span className="text-slate-400 text-sm">/ {isPg ? "month" : "night"}</span>
              {!isPg && <span className="text-xs text-slate-400 ml-1">per room</span>}
              {!isPg && dateRange?.from && dateRange?.to && (
                <span className="ml-auto text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  Total: {formatINR(room.price * Math.max(1, Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))))}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {/* 360° View */}
              <button
                onClick={() => {
                  onClose();
                  on360(room);
                }}
                disabled={!room.panoramaUrl}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  room.panoramaUrl
                    ? "bg-slate-900 text-white hover:bg-slate-700"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <ScanEye className="size-4" />
                {room.panoramaUrl ? "View 360°" : "360° N/A"}
              </button>

              {/* Book CTA */}
              {isPg ? (
                selectedInRoom ? (
                  <Link
                    href={`/booking/${propertySlug}/${room.id}/${selectedBeds.find((id) =>
                      room.beds?.some((b) => Number(b.id) === id)
                    )}`}
                    className="flex-1 text-center px-4 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-rose-600 text-white text-sm font-semibold shadow-warm hover:opacity-95 transition-opacity"
                  >
                    Book Selected Bed
                  </Link>
                ) : (
                  <button
                    onClick={onClose}
                    className="flex-1 text-center px-4 py-2.5 rounded-full bg-amber-600 text-white text-sm font-semibold hover:opacity-95 transition-opacity"
                  >
                    Select a Bed Above
                  </button>
                )
              ) : (
                <Link
                  href={room.available ? `/booking/${propertySlug}/${room.id}${dateRange?.from ? `?checkIn=${dateRange.from.toISOString()}${dateRange.to ? `&checkOut=${dateRange.to.toISOString()}` : ''}` : ''}` : "#"}
                  className={`flex-1 text-center px-4 py-2.5 rounded-full text-sm font-semibold transition-opacity ${
                    room.available
                      ? "bg-linear-to-r from-orange-500 to-rose-600 text-white shadow-warm hover:opacity-95"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {room.available ? "Book this Room" : "Sold Out"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
