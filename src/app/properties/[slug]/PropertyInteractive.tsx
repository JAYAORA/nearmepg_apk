"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Heart,
  ScanEye,
  Snowflake,
  Fan,
  CheckCircle,
  XCircle,
  HourglassIcon,
  Users,
  SlidersHorizontal,
  Phone,
  Copy,
  CircleUser,
  MinusSquare,
  ArrowUpDown,
  BedDouble,
  Hotel,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import type { DateRange } from "react-day-picker";
import { useAuth } from "@/data/auth-context";
import { formatINR } from "@/lib/utils";
import type { Room } from "@/types/property";
import RoomDetailsModal from "./RoomDetailsModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyMini {
  id: string;
  slug: string;
  name: string;
  propertyType: string;
  price: number;
  pricingUnit: string;
  googleMapsLink?: string;
  owner_contact?: string;
  owner_name?: string;
  verified?: boolean;
}

interface Props {
  property: PropertyMini;
  rooms: Room[];
  isPg: boolean;
}

type SortOrder = "none" | "asc" | "desc";

// ─── 360° Panorama Viewer ─────────────────────────────────────────────────────

interface ViewerProps {
  room: Room;
  hostelSlug: string;
  isPg: boolean;
  open: boolean;
  onClose: () => void;
  selectedBeds: number[];
  onBedSelect: (bedId: number, status: string) => void;
  selectedRoomId?: string;
  isVerified: boolean;
  dateRange?: DateRange;
}

function PanoramaViewer({
  room,
  hostelSlug,
  isPg,
  open,
  onClose,
  selectedBeds,
  onBedSelect,
  selectedRoomId,
  isVerified,
  dateRange,
}: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  // Push history entry so back-button closes the dialog
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ psv: true }, "");
    const handlePop = () => onClose();
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [open, onClose]);

  // Init viewer
  useEffect(() => {
    if (!open || !room.panoramaUrl) return;

    const timeout = setTimeout(async () => {
      if (!containerRef.current) return;

      const { Viewer } = await import("@photo-sphere-viewer/core");
      const { MarkersPlugin } =
        await import("@photo-sphere-viewer/markers-plugin");
      await import("@photo-sphere-viewer/core/index.css");
      await import("@photo-sphere-viewer/markers-plugin/index.css");

      const viewer = new Viewer({
        container: containerRef.current!,
        panorama: room.panoramaUrl!,
        plugins: isPg ? [[MarkersPlugin, {}]] : [],
        navbar: ["zoom", "move", "fullscreen"],
        defaultZoomLvl: 30,
        fisheye: true,
      });

      viewerRef.current = viewer;

      if (isPg) {
        const onReady = () => {
          const markers = viewer.getPlugin(MarkersPlugin);
          if (!markers) return;
          markersRef.current = markers;

          markers.addEventListener("select-marker", (e: any) => {
            const bedId = Number(e.marker?.id);
            const bed = room.beds?.find((b: any) => b.id === bedId);
            if (!bed) return;
            onBedSelect(bedId, bed.status);
          });

          renderMarkers(markers, room.beds ?? [], selectedBeds);
        };
        viewer.addEventListener("ready", onReady);
      }

      cleanupRef.current = () => {
        try {
          markersRef.current?.clearMarkers?.();
          viewer.destroy();
        } catch {}
        viewerRef.current = null;
        markersRef.current = null;
      };
    }, 80);

    return () => {
      clearTimeout(timeout);
      cleanupRef.current?.();
      cleanupRef.current = undefined;
    };
  }, [open, room, isPg]);

  // Re-render markers when selection changes (PG only)
  useEffect(() => {
    if (isPg && markersRef.current && room.beds) {
      renderMarkers(markersRef.current, room.beds, selectedBeds);
    }
  }, [selectedBeds, room.beds, isPg]);

  const handleClose = () => {
    cleanupRef.current?.();
    cleanupRef.current = undefined;
    if (window.history.state?.psv) window.history.back();
    onClose();
  };

  // PG: selected bed price
  const pgTotalAmount = selectedBeds.length * room.price;

  if (!room.panoramaUrl) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="w-full max-w-sm md:max-w-7xl text-center">
          <p className="text-slate-500 py-8">
            No 360° panorama available for this room.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-11/12 md:w-full max-w-sm md:max-w-7xl h-[90vh] p-0 bg-black border-0 rounded-2xl overflow-hidden"
      >
        <DialogTitle className="text-white sr-only">
          Panoramic 360° View of {room.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Panoramic 360° View of {room.name}
        </DialogDescription>

        {/* PSV container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Room name label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-white text-sm font-semibold px-4 py-2 rounded-full pointer-events-none">
          {room.name} · 360° View
        </div>

        {/* Floating booking bar — PG (bed selected) */}
        {isPg && selectedBeds.length > 0 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl text-white w-72">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="font-semibold">Bed selected</span>
              <span className="font-bold">{formatINR(pgTotalAmount)}/mo</span>
            </div>
            {isVerified ? (
              <Link
                href={`/booking/${hostelSlug}/${room.id}/${selectedBeds[0]}`}
                className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Book Selected Bed
              </Link>
            ) : (
              <button
                disabled
                className="block w-full text-center bg-slate-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-not-allowed"
                title="Booking disabled: Property is unverified"
              >
                Booking Disabled
              </button>
            )}
          </div>
        )}

        {/* Floating booking bar — Hotel */}
        {!isPg && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl text-white w-72">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="font-semibold">{room.name}</span>
              <span className="font-bold">{formatINR(room.price)}/night</span>
            </div>
            {!isVerified ? (
              <div
                className="block w-full text-center bg-slate-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-not-allowed"
                title="Booking disabled: Property is unverified"
              >
                Booking Disabled
              </div>
            ) : room.available ? (
              <Link
                href={`/booking/${hostelSlug}/${room.id}${dateRange?.from && dateRange?.to ? `?checkIn=${dateRange.from.toISOString().split("T")[0]}&checkOut=${dateRange.to.toISOString().split("T")[0]}` : ""}`}
                className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Book this Room
              </Link>
            ) : (
              <div className="block w-full text-center bg-red-500/80 text-white py-2.5 rounded-xl font-semibold text-sm cursor-not-allowed">
                Sold Out
              </div>
            )}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-10"
          aria-label="Close 360° viewer"
        >
          ✕
        </button>
      </DialogContent>
    </Dialog>
  );
}

function renderMarkers(markers: any, beds: any[], selectedBeds: number[]) {
  try {
    markers.clearMarkers?.();
  } catch {}

  beds.forEach((bed: any) => {
    if (typeof bed.yaw !== "number" || typeof bed.pitch !== "number") return;
    const isSelected = selectedBeds.includes(bed.id);
    const isAvailable = bed.status === "available";
    const isReserved = bed.status === "reserved";

    const bgColor = isAvailable
      ? isSelected
        ? "#1e3a8a"
        : "#22c55e"
      : isReserved
        ? "#eab308"
        : "#ef4444";

    markers.addMarker({
      id: String(bed.id),
      position: { yaw: bed.yaw, pitch: bed.pitch },
      html: `<div style="background:${bgColor};color:white;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.3);text-align:center;cursor:pointer">
        ${bed.label ?? `Bed ${bed.id}`}
        <div style="font-size:10px;opacity:0.9">${
          isAvailable
            ? isSelected
              ? "Selected"
              : "Tap to select"
            : isReserved
              ? "Reserved"
              : "Occupied"
        }</div>
      </div>`,
      tooltip: {
        content: `${bed.label ?? "Bed " + bed.id} — ${bed.status}`,
      },
    });
  });
}

// ─── Room Card ────────────────────────────────────────────────────────────────

interface RoomCardProps {
  room: Room;
  slug: string;
  isPg: boolean;
  selectedBeds: number[];
  selectedHotelRoomId: string | null;
  onBedSelect: (bedId: number, status: string, roomId: string) => void;
  onHotelRoomSelect: (roomId: string) => void;
  on360: (room: Room) => void;
  onViewDetails: (room: Room) => void;
  isVerified: boolean;
}

function RoomCard({
  room,
  slug,
  isPg,
  selectedBeds,
  selectedHotelRoomId,
  onBedSelect,
  onHotelRoomSelect,
  on360,
  onViewDetails,
  isVerified,
}: RoomCardProps) {
  const availableBeds =
    room.beds?.filter((b) => b.status === "available").length ?? 0;
  const roomSelectedPG = room.beds?.some((b) =>
    selectedBeds.includes(Number(b.id)),
  );
  const roomSelectedHotel = !isPg && selectedHotelRoomId === room.id;
  const isHighlighted = roomSelectedPG || roomSelectedHotel;

  // Extra hotel fields
  const extra = room as any;
  const maxGuests: number | undefined = extra.maxGuests;
  const bedType: string | undefined = extra.bedType;

  return (
    <div
      id={`room-${room.id}`}
      className={`border rounded-3xl p-5 bg-white transition-all ${
        isHighlighted
          ? "border-amber-400 shadow-warm"
          : "border-slate-200 shadow-soft"
      }`}
    >
      {/* Room header */}
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base text-slate-900">
              {room.name ?? `${room.sharing}-Sharing Room`}
            </h3>
            {room.hasAC ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                <Snowflake className="h-2.5 w-2.5" /> AC
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                <Fan className="h-2.5 w-2.5" /> Non-AC
              </span>
            )}
            {room.floor != null && (
              <span className="text-[10px] font-medium text-slate-400">
                Floor {room.floor}
              </span>
            )}
            {isPg && (
              <span className="text-[10px] font-medium text-slate-400">
                {room.sharing} Sharing
              </span>
            )}
            {!isPg && bedType && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                <BedDouble className="h-2.5 w-2.5" /> {bedType}
              </span>
            )}
            {!isPg && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  room.available
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {room.available ? "Available" : "Sold Out"}
              </span>
            )}
          </div>
          {!isPg && maxGuests && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Users className="size-3" /> Up to {maxGuests} guests
            </p>
          )}
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-slate-900">
            {formatINR(room.price)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">
            per {isPg ? "month" : "night"}
          </div>
        </div>
      </div>

      {/* Bed status grid — PG only */}
      {isPg && room.beds && room.beds.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-2 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" />
            <span>
              {availableBeds} of {room.beds.length} beds available
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {room.beds.map((bed) => {
              const bedId = Number(bed.id);
              const isSelected = selectedBeds.includes(bedId);
              const isAvail = bed.status === "available";
              const isRes = bed.status === "reserved";

              return (
                <button
                  key={bed.id}
                  disabled={!isAvail || !isVerified}
                  onClick={() => onBedSelect(bedId, bed.status, room.id)}
                  title={
                    !isVerified
                      ? "Booking disabled: Property is unverified"
                      : ""
                  }
                  className={`relative p-3 rounded-xl border-2 text-xs font-medium transition-all text-left ${
                    !isVerified
                      ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                      : isAvail
                        ? isSelected
                          ? "border-amber-500 bg-amber-50 text-amber-800"
                          : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-amber-400 cursor-pointer"
                        : isRes
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700 cursor-not-allowed"
                          : "border-red-200 bg-red-50 text-red-700 cursor-not-allowed"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">
                      {bed.label ? String(bed.label) : `Bed ${bed.id}`}
                    </span>
                    {isAvail && isSelected && (
                      <CheckCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    )}
                    {isAvail && !isSelected && (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    )}
                    {isRes && (
                      <HourglassIcon className="h-3.5 w-3.5 shrink-0" />
                    )}
                    {!isAvail && !isRes && (
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </div>
                  <div className="mt-0.5 capitalize opacity-80">
                    {bed.status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hotel room selection indicator */}
      {!isPg && roomSelectedHotel && (
        <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
          <CheckCircle className="size-4" />
          <span className="font-medium">Room selected</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {/* 360° View */}
        <button
          onClick={() => on360(room)}
          disabled={!room.panoramaUrl}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            room.panoramaUrl
              ? "bg-slate-900 text-white hover:bg-slate-700 cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <ScanEye className="h-4 w-4" />
          {room.panoramaUrl ? "View 360°" : "360° N/A"}
        </button>

        {/* View Room Details (opens modal) */}
        <button
          onClick={() => onViewDetails(room)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:border-amber-400 hover:text-amber-700 transition-all"
        >
          <Info className="h-4 w-4" />
          Room Details
        </button>

        {/* Hotel: "Select Room" / "Book Now" */}
        {!isPg && (
          <button
            disabled={!room.available || !isVerified}
            onClick={() => room.available && onHotelRoomSelect(room.id)}
            title={
              !isVerified ? "Booking disabled: Property is unverified" : ""
            }
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              !isVerified
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : !room.available
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : roomSelectedHotel
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-amber-600 text-white hover:opacity-90"
            }`}
          >
            <Hotel className="h-4 w-4" />
            {!room.available
              ? "Sold Out"
              : roomSelectedHotel
                ? "✓ Selected"
                : "Select Room"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PropertyInteractive({ property, rooms, isPg }: Props) {
  const { isAuthenticated, user } = useAuth();

  // ── Save / Wishlist ─────────────────────────────────────────────────────────
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedProperties") || "[]");
    setIsSaved(saved.includes(property.id));
  }, [property.id]);

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save properties.");
      return;
    }
    const saved: string[] = JSON.parse(
      localStorage.getItem("savedProperties") || "[]",
    );
    let updated: string[];
    if (isSaved) {
      updated = saved.filter((id) => id !== property.id);
      toast("Removed from saved");
    } else {
      updated = [...saved, property.id];
      toast.success(`Saved ${property.name}!`, { icon: "❤️" });
    }
    localStorage.setItem("savedProperties", JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  // ── Contact reveal ──────────────────────────────────────────────────────────
  const ownerPhone = property.owner_contact ?? null;
  const contactDisplay = ownerPhone ?? "XXXXX XXXXX";
  const formattedPhone = contactDisplay
    .toString()
    .replace(/(\d{5})(\d{5})/, "$1 $2");

  const handleCopyPhone = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to reveal contact number.");
      return;
    }
    const num = ownerPhone ?? "";
    if (!num) {
      toast.error("Contact number not available.");
      return;
    }
    try {
      await navigator.clipboard.writeText("+91 " + num);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy.");
    }
  };

  // ── Room filters ────────────────────────────────────────────────────────────
  const [acFilter, setAcFilter] = useState<"all" | "ac" | "nonac">("all");
  const [sharingFilter, setSharingFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const [showFilters, setShowFilters] = useState(false);

  // ── Date Range (Hotel Only) ──────────────────────────────────────────────────
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [blockedDatesByRoom, setBlockedDatesByRoom] = useState<
    Record<string, { start: Date; end: Date }[]>
  >({});

  useEffect(() => {
    if (isPg) return;
    fetch(`/api/properties/${property.slug}/blocked-dates`)
      .then((res) => res.json())
      .then((data) => {
        if (data.blockedDatesByRoom) {
          const parsed: Record<string, { start: Date; end: Date }[]> = {};
          for (const [roomId, ranges] of Object.entries(
            data.blockedDatesByRoom,
          )) {
            parsed[roomId] = (ranges as any[]).map((r) => ({
              start: new Date(r.start),
              end: new Date(r.end),
            }));
          }
          setBlockedDatesByRoom(parsed);
        }
      })
      .catch(console.error);
  }, [isPg, property.slug]);

  const floors = useMemo(
    () =>
      [...new Set(rooms.map((r) => r.floor).filter((f) => f != null))].sort(),
    [rooms],
  );

  const isDateRangeOverlapping = (
    roomBlockedDates: { start: Date; end: Date }[],
    from: Date,
    to: Date,
  ) => {
    const checkStart = new Date(from);
    checkStart.setHours(0, 0, 0, 0);
    const checkEnd = new Date(to);
    checkEnd.setHours(0, 0, 0, 0);

    return roomBlockedDates.some((range) => {
      const rStart = new Date(range.start);
      rStart.setHours(0, 0, 0, 0);
      const rEnd = new Date(range.end);
      rEnd.setHours(0, 0, 0, 0);
      return checkStart < rEnd && checkEnd > rStart; // overlap if start1 < end2 AND end1 > start2
    });
  };

  const filteredRooms = useMemo(() => {
    let r = rooms
      .map((room) => {
        let available = room.available;
        if (!isPg && dateRange?.from && dateRange?.to) {
          const blocks = blockedDatesByRoom[room.id] || [];
          if (isDateRangeOverlapping(blocks, dateRange.from, dateRange.to)) {
            available = false;
          }
        }
        return { ...room, available };
      })
      .filter((room) => {
        if (acFilter === "ac" && !room.hasAC) return false;
        if (acFilter === "nonac" && room.hasAC) return false;
        if (
          isPg &&
          sharingFilter !== "all" &&
          String(room.sharing) !== sharingFilter
        )
          return false;
        if (floorFilter !== "all" && String(room.floor) !== floorFilter)
          return false;
        if (availableOnly && !room.available) return false;
        return true;
      });
    if (sortOrder === "asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [
    rooms,
    acFilter,
    sharingFilter,
    floorFilter,
    availableOnly,
    sortOrder,
    isPg,
    dateRange,
    blockedDatesByRoom,
  ]);

  // ── PG: Bed selection ───────────────────────────────────────────────────────
  const [selectedBeds, setSelectedBeds] = useState<number[]>([]);

  const handleBedSelect = useCallback(
    (bedId: number, status: string, _roomId: string) => {
      if (status !== "available" || property.verified === false) return;
      setSelectedBeds((prev) =>
        prev.includes(bedId) ? prev.filter((id) => id !== bedId) : [bedId],
      );
    },
    [property.verified],
  );

  // ── Hotel: Room selection ───────────────────────────────────────────────────
  const [selectedHotelRoomId, setSelectedHotelRoomId] = useState<string | null>(
    null,
  );

  const handleHotelRoomSelect = useCallback(
    (roomId: string) => {
      if (property.verified === false) return;
      setSelectedHotelRoomId((prev) => (prev === roomId ? null : roomId));
    },
    [property.verified],
  );

  const selectedHotelRoom = useMemo(
    () =>
      selectedHotelRoomId
        ? (rooms.find((r) => r.id === selectedHotelRoomId) ?? null)
        : null,
    [selectedHotelRoomId, rooms],
  );

  // ── 360° viewer ─────────────────────────────────────────────────────────────
  const [panoramaRoom, setPanoramaRoom] = useState<Room | null>(null);

  // ── Room Details Modal ──────────────────────────────────────────────────────
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);

  // ── PG: total amount from selected bed ─────────────────────────────────────
  const pgTotalAmount =
    selectedBeds.length > 0
      ? (rooms.find((r) =>
          r.beds?.some((b) => selectedBeds.includes(Number(b.id))),
        )?.price ?? 0)
      : 0;

  const selectedBedRoomId =
    selectedBeds.length > 0
      ? (rooms.find((r) =>
          r.beds?.some((b) => selectedBeds.includes(Number(b.id))),
        )?.id ?? "")
      : "";

  return (
    <div id="rooms">
      {/* ── Owner + Save row ── */}
      <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CircleUser className="h-5 w-5 text-amber-600" />
            <span>{property.owner_name ?? "Property Owner"}</span>
          </div>
          <button
            onClick={handleCopyPhone}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 transition-all active:scale-95"
            title={
              isAuthenticated
                ? "Copy contact number"
                : "Sign in to reveal contact"
            }
          >
            <Phone className="h-4 w-4 text-emerald-600" />
            <span className={!isAuthenticated ? "blur-sm select-none" : ""}>
              +91 {isAuthenticated ? formattedPhone : "XXXXX XXXXX"}
            </span>
            <Copy className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
        {/* <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
            isSaved
              ? "bg-rose-50 border-rose-300 text-rose-600"
              : "bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-500"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`}
          />
          {isSaved ? "Saved" : "Save"}
        </button> */}
      </div>

      {/* ── Rooms section ── */}
      {rooms.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-display text-xl font-bold text-slate-900">
              {isPg ? "Rooms & Beds" : "Room Types"}
            </h2>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:border-amber-400 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {!isPg && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <label className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                Check Availability:
              </label>
              <div className="w-full max-w-sm">
                <DateRangePicker date={dateRange} setDate={setDateRange} />
              </div>
            </div>
          )}

          {/* Filters panel */}
          {showFilters && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                {/* AC filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                    AC
                  </span>
                  {(["all", "ac", "nonac"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setAcFilter(v)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        acFilter === v
                          ? "bg-amber-600 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300"
                      }`}
                    >
                      {v === "all" ? "All" : v === "ac" ? "AC" : "Non-AC"}
                    </button>
                  ))}
                </div>

                {/* Sharing filter — PG only */}
                {isPg && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Sharing
                    </span>
                    {["all", "1", "2", "3", "4"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setSharingFilter(v)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          sharingFilter === v
                            ? "bg-amber-600 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300"
                        }`}
                      >
                        {v === "all" ? "All" : `${v}×`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                {/* Floor filter */}
                {floors.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Floor
                    </span>
                    <button
                      onClick={() => setFloorFilter("all")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        floorFilter === "all"
                          ? "bg-amber-600 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300"
                      }`}
                    >
                      All
                    </button>
                    {floors.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFloorFilter(String(f))}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          floorFilter === String(f)
                            ? "bg-amber-600 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sort */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                  {(["none", "asc", "desc"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setSortOrder(v)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        sortOrder === v
                          ? "bg-slate-800 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {v === "none"
                        ? "Default"
                        : v === "asc"
                          ? "Price ↑"
                          : "Price ↓"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available only toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                <div
                  onClick={() => setAvailableOnly((s) => !s)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    availableOnly ? "bg-amber-500" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      availableOnly ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Show available only
                </span>
              </label>
            </div>
          )}

          {/* Room cards */}
          {filteredRooms.length > 0 ? (
            <div className="space-y-4">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  slug={property.slug}
                  isPg={isPg}
                  selectedBeds={selectedBeds}
                  selectedHotelRoomId={selectedHotelRoomId}
                  onBedSelect={handleBedSelect}
                  onHotelRoomSelect={handleHotelRoomSelect}
                  on360={(r) => setPanoramaRoom(r)}
                  onViewDetails={(r) => setDetailRoom(r)}
                  isVerified={property.verified !== false}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-50 rounded-3xl">
              <p className="text-slate-400">No rooms match your filters.</p>
              <button
                onClick={() => {
                  setAcFilter("all");
                  setSharingFilter("all");
                  setFloorFilter("all");
                  setAvailableOnly(false);
                }}
                className="mt-3 text-sm text-amber-600 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── PG: Bed selection legend ── */}
      {isPg && rooms.length > 0 && (
        <div className="mt-6 flex items-center gap-5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{" "}
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Reserved
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Occupied
          </div>
        </div>
      )}

      {/* ── Contact Owner ── */}
      {/* {property.owner_contact && (
        <div className="mt-12 mb-8">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Contact Owner</h2>
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{property.owner_name ?? "Property Owner"}</p>
                <p className="text-lg font-bold text-slate-900">+91 {property.owner_contact}</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(property.owner_contact!);
                toast.success("Phone number copied!");
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Number
            </button>
          </div>
        </div>
      )} */}

      {/* ── Sticky bottom bar — PG (bed selected) ── */}
      {isPg && selectedBeds.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-xl px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedBeds([])}
                className="text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Clear selected bed"
              >
                <MinusSquare className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs text-slate-400">Selected bed</p>
                <p className="text-sm font-semibold text-slate-800">
                  Bed {selectedBeds[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">
                  {formatINR(pgTotalAmount)}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  per month
                </div>
              </div>
              {property.verified !== false ? (
                <Link
                  href={`/booking/${property.slug}/${selectedBedRoomId}/${selectedBeds[0]}`}
                  className="px-5 py-2.5 rounded-full bg-amber-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Book Now
                </Link>
              ) : (
                <button
                  disabled
                  title="Booking disabled: Property is unverified"
                  className="px-5 py-2.5 rounded-full bg-slate-300 text-slate-500 text-sm font-semibold cursor-not-allowed whitespace-nowrap"
                >
                  Booking Disabled
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky bottom bar — Hotel (room selected) ── */}
      {!isPg && selectedHotelRoom && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-xl px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedHotelRoomId(null)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Clear selected room"
              >
                <MinusSquare className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs text-slate-400">Selected room</p>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedHotelRoom.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">
                  {formatINR(selectedHotelRoom.price)}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  per night
                </div>
              </div>
              {property.verified !== false ? (
                <Link
                  href={`/booking/${property.slug}/${selectedHotelRoom.id}${dateRange?.from && dateRange?.to ? `?checkIn=${dateRange.from.toISOString().split("T")[0]}&checkOut=${dateRange.to.toISOString().split("T")[0]}` : ""}`}
                  className="px-5 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-rose-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shadow-warm"
                >
                  Book Room
                </Link>
              ) : (
                <button
                  disabled
                  title="Booking disabled: Property is unverified"
                  className="px-5 py-2.5 rounded-full bg-slate-300 text-slate-500 text-sm font-semibold cursor-not-allowed whitespace-nowrap shadow-warm"
                >
                  Booking Disabled
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 360° Panorama modal ── */}
      {panoramaRoom && (
        <PanoramaViewer
          room={panoramaRoom}
          hostelSlug={property.slug}
          isPg={isPg}
          open={!!panoramaRoom}
          onClose={() => setPanoramaRoom(null)}
          selectedBeds={selectedBeds}
          onBedSelect={(bedId, status) =>
            handleBedSelect(bedId, status, panoramaRoom.id)
          }
          selectedRoomId={selectedHotelRoomId ?? undefined}
          isVerified={property.verified !== false}
          dateRange={dateRange}
        />
      )}

      {/* ── Room Details Modal ── */}
      <RoomDetailsModal
        room={detailRoom}
        propertySlug={property.slug}
        isPg={isPg}
        selectedBeds={selectedBeds}
        onBedSelect={handleBedSelect}
        on360={(r) => {
          setPanoramaRoom(r);
        }}
        onClose={() => setDetailRoom(null)}
      />
    </div>
  );
}
