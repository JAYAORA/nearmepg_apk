"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  Link as LinkIcon,
  Check,
  Share,
  Star,
  MapPin,
  ShieldCheck,
  SparklesIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Property } from "@/types/property";
import { formatINR } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

interface ShareButtonProps {
  property: Property;
}

export default function ShareButton({ property }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Determine gender/type badge styling
  const typeMap: Record<string, { label: string; bg: string; text: string }> = {
    "pg-men": {
      label: "Men's PG",
      bg: "bg-teal-100/80",
      text: "text-teal-800",
    },
    "pg-women": {
      label: "Women's PG",
      bg: "bg-violet-100/80",
      text: "text-violet-800",
    },
    "pg-coed": { label: "Co-ed PG", bg: "bg-sky-100/80", text: "text-sky-800" },
    coliving: {
      label: "Co-Living",
      bg: "bg-amber-100/80",
      text: "text-amber-800",
    },
    hotel: { label: "Hotel", bg: "bg-slate-100/80", text: "text-slate-800" },
  };

  const key =
    property.propertyType === "hotel"
      ? "hotel"
      : property.propertyType === "coliving"
        ? "coliving"
        : `pg-${property.gender ?? "coed"}`;

  const badgeMeta = typeMap[key] ?? typeMap["pg-coed"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.origin + "/properties/" + property.slug);
      // Check if navigator.share is supported
      setCanShare(!!navigator.share);
    }
  }, [property.slug]);

  // Construct custom WhatsApp message
  const whatsappMessage = `Hey! Check out this amazing place I found on NearMePG:

🏡 *${property.name}*
📍 ${property.area}, ${property.city}
💰 Starting from ${formatINR(property.price)} / ${property.pricingUnit === "night" ? "night" : "month"}
⭐ Rating: ${property.rating} (${property.reviewCount} reviews)

Check details and book here:
🔗 ${shareUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleSystemShare = async () => {
    try {
      await navigator.share({
        title: property.name,
        text: whatsappMessage,
        url: shareUrl,
      });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        toast.error("Failed to share.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="mt-5 w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors py-2.5 border border-dashed border-slate-200 hover:border-slate-400 rounded-2xl cursor-pointer">
          <Share2 className="h-4 w-4" />
          Share this property
        </button>
      </DialogTrigger>

      <DialogContent
  className="
    w-[calc(100vw-24px)]
    max-w-md
    p-0
    overflow-hidden
    border-0
    rounded-[28px]
    sm:rounded-[32px]
    bg-white
    shadow-[0_24px_80px_rgba(0,0,0,0.18)]
  "
>
  {/* Header */}
  <div className="px-4 sm:px-6 pt-5 sm:pt-6">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-slate-900">
        <Share2 className="h-5 w-5 text-amber-500" />
        Share Property
      </DialogTitle>

      <DialogDescription className="text-sm text-slate-500 mt-1">
        Send this listing to friends, family, or save it for later.
      </DialogDescription>
    </DialogHeader>
  </div>

  <div
    className="
      px-4 sm:px-6
      py-4 sm:py-5
      space-y-4 sm:space-y-5
      pb-[max(16px,env(safe-area-inset-bottom))]
    "
  >
    {/* Property Hero Card */}
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-4/3 sm:aspect-16/10">
        <Image
          src={property.images?.[0] || property.thumbnail}
          alt={property.name}
          fill
          sizes="(max-width:640px) 100vw, 400px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${badgeMeta.bg} ${badgeMeta.text}`}
          >
            {badgeMeta.label}
          </span>

          {property.verified && (
            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-emerald-500 text-white shadow-md">
              <ShieldCheck className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-base sm:text-lg leading-tight line-clamp-2">
            {property.name}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-white/80 text-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {property.area}, {property.city}
            </span>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div>
              <div className="text-xl sm:text-2xl font-bold">
                {formatINR(property.price)}
              </div>

              <div className="text-xs text-white/70">
                per{" "}
                {property.pricingUnit === "night"
                  ? "night"
                  : "month"}
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">
                {Number(property.rating).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Verified listing on NearMePG
        </div>
      </div>
    </div>

    {/* WhatsApp CTA */}
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => setOpen(false)}
      className="
        flex h-12
        items-center justify-center gap-3
        rounded-2xl
        bg-emerald-600
        text-white
        font-semibold
        shadow-lg shadow-emerald-600/20
        transition-all
        hover:bg-emerald-700
        active:scale-[0.98]
      "
    >
      <svg
        className="h-5 w-5 fill-white"
        viewBox="0 0 24 24"
      >
        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.921 9.921 0 0 0 4.887 1.277h.005c5.505 0 9.989-4.478 9.99-9.985A9.972 9.972 0 0 0 12.012 2z" />
      </svg>

      Share on WhatsApp
    </a>

    {/* Actions */}
    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
      {canShare ? (
        <button
          onClick={handleSystemShare}
          className="
            h-12
            rounded-2xl
            border border-slate-200
            bg-slate-50
            hover:bg-slate-100
            text-slate-700
            font-medium
            flex items-center justify-center gap-2
            transition-all
          "
        >
          <Share className="h-4 w-4" />
          More Apps
        </button>
      ) : (
        <button
          onClick={handleCopyLink}
          className="
            h-12
            rounded-2xl
            border border-slate-200
            bg-slate-50
            hover:bg-slate-100
            text-slate-700
            font-medium
            flex items-center justify-center gap-2
            transition-all
          "
        >
          <LinkIcon className="h-4 w-4" />
          Copy Link
        </button>
      )}

      <button
        onClick={handleCopyLink}
        className="
          h-12
          rounded-2xl
          bg-slate-900
          hover:bg-black
          text-white
          font-medium
          flex items-center justify-center gap-2
          transition-all
        "
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-400" />
            Copied
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            Copy Link
          </>
        )}
      </button>
    </div>


    {/* Footer */}
    <div className="border-t border-slate-100 pt-4">
      <p className="text-center text-[11px] text-slate-400">
        Shared via NearMePG
      </p>
    </div>
  </div>
</DialogContent>
    </Dialog>
  );
}
