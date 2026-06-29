"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Image as ImageIcon,
  ListChecks,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { PropertyPayload } from "@/lib/admin-api";

// ── Constants ────────────────────────────────────────────────────────────────

const AMENITY_OPTIONS = [
  "WiFi", "High-Speed WiFi", "TV", "Intercom",
  "AC", "Non-AC", "Fan", "Heater", "Geyser", "Attached Bathroom", "Western Toilet", "Balcony",
  "Food", "Breakfast", "Lunch", "Dinner", "Laundry", "Housekeeping", "Washing Machine",
  "Gym", "Swimming Pool", "Study Room", "Common Room", "Rooftop", "Cafeteria", "Parking", "Lift",
  "CCTV", "Security", "Gatekeeper", "24/7 Water", "Power", "Power Backup", "Locker",
];

const STEPS = [
  { id: 1, label: "Basic Info", icon: Building2 },
  { id: 2, label: "Location",   icon: MapPin },
  { id: 3, label: "Media",      icon: ImageIcon },
  { id: 4, label: "Amenities",  icon: ListChecks },
];

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  /** Firestore document id — only present when editing */
  propertyId?: string;
  /** Pre-filled values for editing */
  initialData?: Partial<PropertyPayload>;
  ownerEmail: string;
  onSubmit: (payload: PropertyPayload) => Promise<void>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function FormError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      {message}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${className}`}
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

function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none ${className}`}
      {...props}
    />
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function PropertyForm({
  propertyId,
  initialData,
  ownerEmail,
  onSubmit,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Step state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Form state (mirrors PropertyPayload) ──────────────────────────────────
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [propertyType, setPropertyType] = useState<"pg" | "hotel" | "coliving">(
    initialData?.propertyType ?? "pg"
  );
  const [gender, setGender] = useState<"men" | "women" | "coed" | "">(
    initialData?.gender ?? ""
  );
  const [price, setPrice] = useState<number>(initialData?.price ?? 0);
  const [pricingUnit, setPricingUnit] = useState<"month" | "night">(
    initialData?.pricingUnit ?? "month"
  );
  const [verified, setVerified] = useState(initialData?.verified ?? false);
  const [rating, setRating] = useState<number>(initialData?.rating ?? 0);
  const [reviewCount, setReviewCount] = useState<number>(
    initialData?.reviewCount ?? 0
  );

  // Location
  const [city, setCity] = useState(initialData?.city ?? "");
  const [area, setArea] = useState(initialData?.area ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [googleMapsLink, setGoogleMapsLink] = useState(
    initialData?.googleMapsLink ?? ""
  );

  // Media
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail ?? "");
  const [images, setImages] = useState<string[]>(initialData?.images ?? [""]);

  // Amenities
  const [amenities, setAmenities] = useState<string[]>(
    initialData?.amenities ?? []
  );

  // ── Auto-slugify ──────────────────────────────────────────────────────────
  const handleNameChange = (v: string) => {
    setName(v);
    if (!propertyId) setSlug(slugify(v)); // only auto-fill on create
  };

  // ── Images helpers ────────────────────────────────────────────────────────
  const addImageRow = () => setImages((p) => [...p, ""]);
  const removeImageRow = (i: number) =>
    setImages((p) => p.filter((_, idx) => idx !== i));
  const updateImageRow = (i: number, v: string) =>
    setImages((p) => p.map((url, idx) => (idx === i ? v : url)));

  // ── Amenity toggle ────────────────────────────────────────────────────────
  const toggleAmenity = (a: string) =>
    setAmenities((p) =>
      p.includes(a) ? p.filter((x) => x !== a) : [...p, a]
    );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    setSubmitError(null);

    const payload: PropertyPayload = {
      name,
      slug,
      description,
      propertyType,
      gender: gender || undefined,
      price,
      pricingUnit,
      rating,
      reviewCount,
      verified,
      city,
      area,
      location,
      googleMapsLink: googleMapsLink || undefined,
      thumbnail,
      images: images.filter((u) => u.trim() !== ""),
      amenities,
      owner_mail: ownerEmail,
    };

    startTransition(async () => {
      try {
        await onSubmit(payload);
        router.push("/admin/properties");
      } catch (err: any) {
        setSubmitError(err.message ?? "Something went wrong");
      }
    });
  };

  // ── Step validation ───────────────────────────────────────────────────────
  const canProceed = () => {
    if (step === 1) return name.trim().length >= 3 && slug.trim().length >= 3 && price > 0;
    if (step === 2) return city.trim().length >= 2 && area.trim().length >= 2 && location.trim().length >= 5;
    if (step === 3) return thumbnail.trim().length > 0;
    return true;
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
                <span className="sm:hidden">{s.id}</span>
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
            <h2 className="font-display text-lg font-bold text-slate-900">Basic Information</h2>

            <div>
              <Label required>Property Name</Label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Green Valley PG for Men"
              />
            </div>

            <div>
              <Label required>
                URL Slug
                <span className="ml-1.5 text-xs font-normal text-slate-400">
                  (auto-filled · editable)
                </span>
              </Label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition-all">
                <span className="text-sm text-slate-400 shrink-0">/properties/</span>
                <input
                  className="flex-1 text-sm text-slate-900 focus:outline-none bg-transparent"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="green-valley-pg"
                />
              </div>
            </div>

            <div>
              <Label required>Description</Label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the property, its surroundings, and what makes it special…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Property Type</Label>
                <Select
                  value={propertyType}
                  onChange={(e) => {
                    const v = e.target.value as typeof propertyType;
                    setPropertyType(v);
                    setPricingUnit(v === "hotel" ? "night" : "month");
                  }}
                >
                  <option value="pg">PG / Hostel</option>
                  <option value="hotel">Hotel</option>
                  {/* <option value="coliving">Co-Living</option> */}
                </Select>
              </div>
              {propertyType !== "hotel" && (
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as typeof gender)}
                  >
                    <option value="">Any / Co-ed</option>
                    <option value="men">Men Only</option>
                    <option value="women">Women Only</option>
                    <option value="coed">Co-ed</option>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Starting Price (₹)</Label>
                <Input
                  type="number"
                  min={1}
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="6000"
                />
              </div>
              <div>
                <Label required>Pricing Unit</Label>
                <Select
                  value={pricingUnit}
                  onChange={(e) => setPricingUnit(e.target.value as "month" | "night")}
                >
                  <option value="month">Per Month</option>
                  <option value="night">Per Night</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rating (0–5)</Label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={rating || ""}
                  onChange={(e) => setRating(Number(e.target.value))}
                  placeholder="4.5"
                />
              </div>
              <div>
                <Label>Review Count</Label>
                <Input
                  type="number"
                  min={0}
                  value={reviewCount || ""}
                  onChange={(e) => setReviewCount(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setVerified((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  verified ? "bg-emerald-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    verified ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-slate-700">Mark as Verified</span>
            </div> */}
          </>
        )}

        {/* ── Step 2: Location ───────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h2 className="font-display text-lg font-bold text-slate-900">Location Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bangalore"
                />
              </div>
              <div>
                <Label required>Area / Locality</Label>
                <Input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Koramangala"
                />
              </div>
            </div>

            <div>
              <Label required>Full Address</Label>
              <Textarea
                rows={3}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="123, 5th Block, Koramangala, Bangalore – 560034"
              />
            </div>

            <div>
              <Label>Google Maps Link</Label>
              <Input
                type="url"
                value={googleMapsLink}
                onChange={(e) => setGoogleMapsLink(e.target.value)}
                placeholder="https://maps.google.com/..."
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Paste the share link from Google Maps (optional but recommended)
              </p>
            </div>
          </>
        )}

        {/* ── Step 3: Media ──────────────────────────────────────────────── */}
        {step === 3 && (
          <>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Images
              <span className="ml-2 text-sm font-normal text-slate-400">(URLs only)</span>
            </h2>

            <div>
              <Label required>Thumbnail URL</Label>
              <Input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/main-photo.jpg"
              />
              {thumbnail && (
                <div className="mt-3 rounded-xl overflow-hidden h-40 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Gallery Images</Label>
                <button
                  type="button"
                  onClick={addImageRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
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
                      placeholder={`https://example.com/photo-${i + 1}.jpg`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageRow(i)}
                      disabled={images.length === 1}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Step 4: Amenities ──────────────────────────────────────────── */}
        {step === 4 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">Amenities</h2>
              <span className="text-sm text-slate-400">
                {amenities.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => {
                const selected = amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selected
                        ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-700"
                    }`}
                  >
                    {selected && "✓ "}
                    {a}
                  </button>
                );
              })}
            </div>

            {/* Review summary */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-sm">
              <p className="font-semibold text-slate-700">Review</p>
              <div className="grid grid-cols-2 gap-1 text-slate-500">
                <span>Name:</span>     <span className="font-medium text-slate-800">{name}</span>
                <span>Type:</span>     <span className="font-medium text-slate-800 capitalize">{propertyType}</span>
                <span>City:</span>     <span className="font-medium text-slate-800">{city}, {area}</span>
                <span>Price:</span>    <span className="font-medium text-slate-800">₹{price}/{pricingUnit}</span>
                <span>Verified:</span> <span className="font-medium text-slate-800">{verified ? "Yes" : "No"}</span>
                <span>Images:</span>   <span className="font-medium text-slate-800">{images.filter(u => u).length + (thumbnail ? 1 : 0)}</span>
              </div>
            </div>

            {submitError && <FormError message={submitError} />}
          </>
        )}
      </div>

      {/* Nav buttons */}
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
            disabled={isPending || !thumbnail.trim()}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-orange-500 to-rose-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-warm"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {propertyId ? "Saving…" : "Creating…"}
              </>
            ) : (
              <>{propertyId ? "Save Changes" : "Create Property"}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
