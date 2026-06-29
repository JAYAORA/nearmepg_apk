"use client";

import { useState, useEffect } from "react";
import { Star, EyeOff, Eye, Loader2 } from "lucide-react";
import { useIsAdmin, useAuth } from "@/data/auth-context";

interface Review {
  id: string;
  userName: string;
  createdAt: string;
  rating: number;
  comment?: string;
  isHidden?: boolean;
}

interface PropertyReviewsProps {
  initialReviews: Review[];
  propertyId: string;
  rating: number;
  reviewCount: number;
}

export default function PropertyReviews({ initialReviews, propertyId, rating, reviewCount }: PropertyReviewsProps) {
  const isAdmin = useIsAdmin();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [toggling, setToggling] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAsAdmin = mounted ? isAdmin : false;
  const visibleReviews = showAsAdmin ? reviews : reviews.filter((r) => !r.isHidden);

  if (visibleReviews.length === 0 && !showAsAdmin) return null;
  if (reviews.length === 0) return null;

  async function toggleVisibility(reviewId: string, currentHidden: boolean) {
    setToggling(reviewId);
    try {
      const res = await fetch(`/api/properties/${propertyId}/reviews/${reviewId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentHidden, requesterRole: user?.role })
      });
      if (!res.ok) throw new Error("Failed to toggle");
      
      setReviews((prev) => 
        prev.map((r) => r.id === reviewId ? { ...r, isHidden: !currentHidden } : r)
      );
    } catch (err) {
      alert("Failed to toggle review visibility.");
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-display text-xl font-bold text-slate-900">Tenant Reviews</h2>
        <span className="inline-flex items-center gap-1 text-sm font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" strokeWidth={0} />
          {Number(rating).toFixed(1)} ({reviewCount})
        </span>
      </div>
      <div className="space-y-4">
        {visibleReviews.map((r) => (
          <div key={r.id} className={`p-5 rounded-2xl border ${r.isHidden ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  {r.userName}
                  {r.isHidden && <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">Hidden</span>}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", month: "short", year: "numeric", day: "numeric" })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= r.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"}`}
                      strokeWidth={0}
                    />
                  ))}
                </div>
                {showAsAdmin && (
                  <button
                    onClick={() => toggleVisibility(r.id, !!r.isHidden)}
                    disabled={toggling === r.id}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-50"
                  >
                    {toggling === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : r.isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {r.isHidden ? "Show" : "Hide"}
                  </button>
                )}
              </div>
            </div>
            {r.comment && <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
