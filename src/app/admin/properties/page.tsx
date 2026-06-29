"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  BedDouble,
  ShieldCheck,
  Star,
  MapPin,
  AlertCircle,
  Loader2,
  Home,
  Search,
  Filter,
} from "lucide-react";
import { useAuth, useIsAdmin } from "@/data/auth-context";
import { adminDeleteProperty, adminGetProperties, adminGetRooms, adminUpdateProperty } from "@/lib/admin-api";
import { formatINR } from "@/lib/utils";

// ── Type badge ───────────────────────────────────────────────────────────────

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  pg:       { label: "PG / Hostel", cls: "bg-teal-100 text-teal-800" },
  hotel:    { label: "Hotel",       cls: "bg-slate-100 text-slate-800" },
  coliving: { label: "Co-Living",   cls: "bg-violet-100 text-violet-800" },
};

const GENDER_BADGE: Record<string, string> = {
  men:   "bg-sky-100 text-sky-800",
  women: "bg-pink-100 text-pink-800",
  coed:  "bg-amber-100 text-amber-800",
};

// ── Property Card Component ──────────────────────────────────────────────────
function PropertyCard({ p, isAdmin, deletingId, handleDelete, setProperties }: any) {
  const typeMeta = TYPE_BADGE[p.propertyType] ?? TYPE_BADGE.pg;
  const isDeleting = deletingId === p.id;

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden flex flex-col transition-all ${
        isDeleting ? "opacity-50 pointer-events-none" : "hover:shadow-warm"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {p.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.thumbnail}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="h-12 w-12 text-slate-300" />
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeMeta.cls}`}>
            {typeMeta.label}
          </span>
          {p.gender && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${GENDER_BADGE[p.gender] ?? "bg-slate-100 text-slate-600"}`}>
              {p.gender}
            </span>
          )}
        </div>

        {p.verified && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur text-[10px] font-bold uppercase text-white">
              <ShieldCheck className="h-2.5 w-2.5" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2">
            {p.name}
          </h2>
          <div className="flex items-center gap-1 shrink-0 text-sm font-semibold">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" strokeWidth={0} />
            {Number(p.rating)?.toFixed(1) ?? 0}
          </div>
        </div>

        {isAdmin && (
          <div className="mt-2 mb-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Owner Details</p>
            <p className="text-sm font-bold text-slate-800 truncate mb-0.5">{p.owner_name || "Unknown Owner"}</p>
            <p className="text-xs text-slate-600 truncate">{p.owner_mail || "No email"}</p>
            {p.owner_contact && <p className="text-xs text-slate-600 mt-0.5">+91 {p.owner_contact}</p>}
          </div>
        )}

        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          {p.area}, {p.city}
        </div>

        <div className="text-xl font-bold text-slate-900">
          {formatINR(p.price)}
          <span className="text-xs font-normal text-slate-400 ml-1">
            /{p.pricingUnit}
          </span>
        </div>

        {p.amenities?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {p.amenities.slice(0, 4).map((a: string) => (
              <span
                key={a}
                className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium"
              >
                {a}
              </span>
            ))}
            {p.amenities.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium px-1">
                +{p.amenities.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          {isAdmin && (
            <button
              onClick={async () => {
                if (!confirm(`Mark ${p.name} as ${p.verified ? "unverified" : "verified"}?`)) return;
                try {
                  await adminUpdateProperty(p.id, { verified: !p.verified });
                  setProperties((props: any[]) => props.map(prop => prop.id === p.id ? { ...prop, verified: !prop.verified } : prop));
                } catch (e) {
                  alert("Failed to update verification status");
                }
              }}
              className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border ${
                p.verified 
                  ? "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100" 
                  : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              {p.verified ? "Verified Property" : "Mark as Verified"}
            </button>
          )}
          <div className="flex items-center gap-2">
            <Link
              href={`/properties/${p.slug}`}
              target="_blank"
              className="flex-1 text-center py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-amber-400 hover:text-amber-700 transition-all"
            >
              View
            </Link>
            <Link
              href={`/admin/properties/${p.id}/edit`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
            <Link
              href={`/admin/properties/${p.id}/rooms`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
            >
              <BedDouble className="h-3.5 w-3.5" />
              Rooms
            </Link>
            <button
              onClick={() => handleDelete(p.id, p.name, p.slug)}
              disabled={isDeleting}
              className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 transition-all"
              title="Delete property"
              aria-label="Delete property"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPropertiesPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Auth rehydrates from localStorage on first render — give it one tick
  useEffect(() => {
    const timer = setTimeout(() => setAuthReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Fetch on mount — wait for auth to rehydrate first
  useEffect(() => {
    if (!authReady) return;
    if (!user?.email) {
      setLoading(false);
      return;
    }

    // Admins see ALL properties; owners see only their own
    const emailParam = isAdmin ? undefined : user.email;
    adminGetProperties(emailParam ?? "")
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Also fetch the user profile to check account_status
    if (user?.id) {
      fetch(`/api/account/profile?uid=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.account_status) {
            setAccountStatus(data.account_status);
          }
        })
        .catch((err) => console.error("Failed to fetch profile:", err));
    }
  }, [user?.email, user?.id, authReady, isAdmin]);


  const handleDelete = async (id: string, name: string, slug: string) => {
    // First check if any room has occupied beds
    try {
      const rooms = await adminGetRooms(slug);
      const hasOccupied = rooms.some((r) =>
        (r.beds ?? []).some((b: any) => b.status === "occupied")
      );
      if (hasOccupied) {
        setDeleteError(`Cannot delete "${name}" — it has tenants currently checked in. Process their early checkout first.`);
        return;
      }
    } catch {
      // If we can't fetch rooms, still allow the backend to reject it
    }

    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleteError(null);
    setDeletingId(id);

    startTransition(async () => {
      try {
        await adminDeleteProperty(id);
        setProperties((p) => p.filter((x) => x.id !== id));
      } catch (err: any) {
        setDeleteError(err.message ?? "Failed to delete property");
      } finally {
        setDeletingId(null);
      }
    });
  };

  // ── Auth guard ───────────────────────────────────────────────────────────
  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="md:max-w-10/12 md:mx-auto px-5 py-16 text-center">
        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign in required</h1>
        <p className="text-slate-500 mb-6">Please sign in to manage your properties.</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Filtering Logic
  const filteredProperties = properties.filter((p) => {
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchLocation = `${p.area} ${p.city} ${p.location}`.toLowerCase().includes(q);
      const matchOwner = `${p.owner_name} ${p.owner_mail} ${p.owner_contact}`.toLowerCase().includes(q);
      if (!matchName && !matchLocation && !matchOwner) return false;
    }
    // Type
    if (filterType !== "all" && p.propertyType !== filterType) return false;
    // Gender
    if (filterGender !== "all" && p.gender !== filterGender) return false;
    // Status
    if (filterStatus === "verified" && !p.verified) return false;
    if (filterStatus === "unverified" && p.verified) return false;

    return true;
  });

  const unverifiedProps = filteredProperties.filter(p => !p.verified);
  const verifiedProps = filteredProperties.filter(p => p.verified);

  return (
    <main className="md:max-w-10/12 md:mx-auto w-full px-5 sm:px-6 py-8 pb-20">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">{isAdmin ? "Properties" : "My Properties"}</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            {isAdmin ? "Properties" : "My Properties"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"} listed
          </p>
        </div>
        {accountStatus === "pending_approval" ? (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            Account Pending Approval
          </div>
        ) : (
          <Link
            href="/admin/properties/new"
            className={`${isAdmin ? "hidden" : "inline-flex"} items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-rose-600 text-white text-sm font-semibold shadow-warm hover:opacity-90 transition-opacity`}
          >
            <Plus className="h-4 w-4" />
            Add New Property
          </Link>
        )}
      </div>

      {accountStatus === "pending_approval" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-amber-800">
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Welcome to NearMePG!
          </h2>
          <p className="text-sm">
            Your account is currently under review by our administration team. Once your profile is verified and approved, you will be able to start adding and managing your properties.
          </p>
        </div>
      )}

      {/* ── Search & Filter Bar ── */}
      {!loading && properties.length > 0 && (
        <div className="mb-8 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, owner, phone, location..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select 
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="pg">PG / Hostel</option>
              <option value="hotel">Hotel</option>
              {/* <option value="coliving">Co-Living</option> */}
            </select>
            <select 
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" 
              value={filterGender} 
              onChange={e => setFilterGender(e.target.value)}
            >
              <option value="all">All Genders</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="coed">Co-ed</option>
            </select>
            {isAdmin && (
              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="unverified">Needs Verification</option>
                <option value="verified">Verified</option>
              </select>
            )}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {(error || deleteError) && (
        <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error ?? deleteError}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && properties.length === 0 && accountStatus !== "pending_approval" && (
        <div className="text-center py-24">
          <Building2 className="h-14 w-14 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No properties yet</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
            Add your first property to start listing it on NearMePG.
          </p>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>
      )}

      {!loading && properties.length === 0 && accountStatus === "pending_approval" && (
        <div className="text-center py-24">
          <Building2 className="h-14 w-14 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Pending Approval</h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Please wait for an admin to approve your account before adding properties.
          </p>
        </div>
      )}

      {/* ── Property grid ── */}
      {!loading && properties.length > 0 && (
        <div className="space-y-12">
          {/* Needs Verification Section */}
          {unverifiedProps.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 text-amber-700 p-2 rounded-xl">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Needs Verification</h2>
                  <p className="text-sm text-slate-500">Properties waiting to be reviewed and approved.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {unverifiedProps.map(p => (
                  <PropertyCard key={p.id} p={p} isAdmin={isAdmin} deletingId={deletingId} handleDelete={handleDelete} setProperties={setProperties} />
                ))}
              </div>
            </section>
          )}

          {/* Verified Section */}
          {verifiedProps.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Verified Properties</h2>
                  <p className="text-sm text-slate-500">Properties that are currently active and visible to tenants.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {verifiedProps.map(p => (
                  <PropertyCard key={p.id} p={p} isAdmin={isAdmin} deletingId={deletingId} handleDelete={handleDelete} setProperties={setProperties} />
                ))}
              </div>
            </section>
          )}

          {filteredProperties.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No properties found matching your search and filters.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
