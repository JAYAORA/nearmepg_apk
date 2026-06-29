"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BedDouble,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Snowflake,
  Fan,
  CheckCircle2,
  XCircle,
  HourglassIcon,
  Users,
  Layers,
  Image as ImageIcon,
  Building2,
} from "lucide-react";
import { useAuth } from "@/data/auth-context";
import {
  adminGetProperties,
  adminGetRooms,
  adminDeletePropertyRoom,
} from "@/lib/admin-api";
import type { RoomPayload, PropertyPayload, BedPayload } from "@/lib/admin-api";
import { formatINR } from "@/lib/utils";

// ── Status dot ────────────────────────────────────────────────────────────────
function BedStatusDot({ status }: { status: string }) {
  if (status === "available")
    return <CheckCircle2 className="h-3 w-3 text-emerald-500" />;
  if (status === "reserved")
    return <HourglassIcon className="h-3 w-3 text-yellow-500" />;
  return <XCircle className="h-3 w-3 text-red-500" />;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PropertyRoomsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [property, setProperty] = useState<(PropertyPayload & { id: string }) | null>(null);
  const [rooms, setRooms] = useState<(RoomPayload & { firestoreId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Auth hydration guard
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authReady || !user?.email || !id) return;

    // Fetch property info (to get slug) and rooms in parallel
    adminGetProperties(user.email)
      .then((props) => {
        const prop = props.find((p) => p.id === id);
        if (!prop) {
          setError("Property not found or you don't own it");
          setLoading(false);
          return;
        }
        setProperty(prop);
        return adminGetRooms(prop.slug);
      })
      .then((r) => {
        if (r) setRooms(r);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [authReady, user?.email, id]);

  const handleDelete = (firestoreId: string, name: string) => {
    if (!confirm(`Delete room "${name}"? This cannot be undone.`)) return;
    setDeleteError(null);
    setDeletingId(firestoreId);

    startTransition(async () => {
      try {
        await adminDeletePropertyRoom(firestoreId);
        setRooms((r) => r.filter((x) => x.firestoreId !== firestoreId));
      } catch (err: any) {
        setDeleteError(err.message ?? "Failed to delete room");
      } finally {
        setDeletingId(null);
      }
    });
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!authReady)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="md:max-w-10/12 md:mx-auto px-5 py-16 text-center">
        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 mb-6">Sign in to manage rooms.</p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-full bg-amber-600 text-white font-semibold text-sm"
        >
          Go to Login
        </Link>
      </div>
    );

  return (
    <main className="md:max-w-10/12 md:mx-auto w-full px-5 sm:px-6 py-8 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
        <Link href="/admin/properties" className="hover:text-amber-600 transition-colors">
          My Properties
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate">
          {property?.name ?? "Rooms"}
        </span>
        <span>/</span>
        <span className="text-slate-800 font-medium">Rooms</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Rooms
          </h1>
          {property && (
            <p className="text-slate-500 text-sm mt-1">
              {property.name} · {rooms.length} room{rooms.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link
          href={`/admin/properties/${id}/rooms/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 text-white text-sm font-semibold shadow-warm hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </Link>
      </div>

      {/* Errors */}
      {(error || deleteError) && (
        <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error ?? deleteError}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      )}

      {/* Empty */}
      {!loading && rooms.length === 0 && !error && (
        <div className="text-center py-24">
          <BedDouble className="h-14 w-14 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No rooms yet</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
            Add rooms so guests can browse and book beds or stay options.
          </p>
          <Link
            href={`/admin/properties/${id}/rooms/new`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add First Room
          </Link>
        </div>
      )}

      {/* Room cards */}
      {!loading && rooms.length > 0 && (
        <div className="space-y-4">
          {rooms.map((room) => {
            const isDeleting = deletingId === room.firestoreId;
            const beds = room.beds ?? [];
            const availBeds = beds.filter((b: BedPayload) => b.status === "available").length;
            const occupiedBeds = beds.filter((b: BedPayload) => b.status === "occupied").length;
            const hasOccupied = occupiedBeds > 0;

            return (
              <div
                key={room.firestoreId}
                className={`bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col sm:flex-row sm:items-center gap-5 transition-all ${
                  isDeleting ? "opacity-50 pointer-events-none" : "hover:shadow-warm"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-36 h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                  {room.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-semibold text-slate-900">
                      {room.name ?? `${room.sharing}-Sharing Room`}
                    </h2>
                    {room.hasAC ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        <Snowflake className="h-2.5 w-2.5" /> AC
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        <Fan className="h-2.5 w-2.5" /> Non-AC
                      </span>
                    )}
                    {room.floor != null && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        <Layers className="h-3 w-3 inline mr-0.5" />Floor {room.floor}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${room.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                      {room.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap mt-1">
                    <span className="font-bold text-slate-900 text-base">
                      {formatINR(room.price)}
                      <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {room.sharing} sharing
                    </span>
                    {room.beds?.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="h-3.5 w-3.5" />
                        {availBeds}/{room.beds.length} beds free
                        {/* Bed status mini dots */}
                        <span className="flex items-center gap-0.5 ml-1">
                          {room.beds.map((bed: BedPayload) => (
                            <BedStatusDot key={bed.id} status={bed.status} />
                          ))}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/properties/${id}/rooms/${room.firestoreId}/edit`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(room.firestoreId, room.name ?? `Room ${room.id}`)}
                    disabled={isDeleting || hasOccupied}
                    title={hasOccupied ? "Cannot delete: room has occupied beds" : "Delete room"}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
