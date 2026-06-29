"use client"

import {
  MapPinIcon,
  MarsIcon,
  StarIcon,
  UsersRoundIcon,
  VenusIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { formatINR } from "@/lib/utils";
import { useRouter } from "next/navigation";

const PGCard = ({
  name,
  slug,
  location,
  price,
  rating,
  img,
  type = "Men",
  user = "tenant",
}: {
  name: string;
  slug: string;
  city: string;
  location: string;
  price: number;
  rating: number;
  img: string;
  type?: string;
  user?: "tenant" | "pg_owner" | "admin";
}) => {
  const navigate = useRouter();

  return (
    <div
      className="w-full min-w-72 sm:min-w-80 overflow-hidden group rounded-xl shadow-md bg-white border border-gray-300 transition-all hover:shadow-xl cursor-pointer"
      onClick={() => {
        if (user === "pg_owner") navigate.push(`/owner/hostel/${slug}`);
        else if (user === "admin") navigate.push(`/admin/hostel/${slug}`);
        else navigate.push(`/hostels/${slug}`);
      }}
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
        <img
          src={img}
          alt={name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {/* Gender Badge */}
          <div className="flex items-center gap-1 bg-green-50 border border-green-900/40 px-2 py-1 rounded-full shrink-0">
            <StarIcon className="w-3.5 h-3.5 md:w-4 md:h-4 fill-green-600 text-green-600" />
            <span className="text-green-700 text-xs md:text-sm font-semibold">
              {rating?.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Action Badges Container */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {/* Gender Badge */}
          <div
            className={`text-white rounded-full p-2.5 shadow-md ${type === "Men"
              ? "bg-blue-600/80"
              : type === "Women"
                ? "bg-pink-600/80"
                : "bg-emerald-600/80"
              }`}
          >
            {type === "Men" ? (
              <MarsIcon size={18} />
            ) : type === "Women" ? (
              <VenusIcon size={18} />
            ) : (
              <UsersRoundIcon size={18} />
            )}
          </div>
        </div>
      </div>

      {/* Reduced vertical padding here (pt-3) to close the gap */}
      <div className="px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4">
        {/* Title and Rating Row */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg sm:text-xl md:text-xl font-bold text-slate-900 leading-6 md:leading-7 mb-1 line-clamp-2 min-h-12">
            {name}
          </h3>
          {/* <h3 className="text-lg sm:text-xl md:text-xl font-bold text-slate-900 leading-6 md:leading-8 mb-1">
            {name}
          </h3> */}
          {/* <div className="flex items-center gap-1 bg-green-50 border border-green-900/40 px-2 py-1 rounded-full shrink-0">
            <StarIcon className="w-3.5 h-3.5 md:w-4 md:h-4 fill-green-600 text-green-600" />
            <span className="text-green-700 text-xs md:text-sm font-semibold">
              {rating}
            </span>
          </div> */}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-500 mb-2 md:mb-2">
          <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs md:text-sm font-semibold truncate max-w-xs">
            {location}
          </span>
        </div>

        {/* Pricing and Action */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
          <div className="flex flex-row gap-1 md:mt-2 items-center justify-between md:flex-col md:items-start">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Starting from
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl md:text-2xl font-bold text-slate-900">
                {formatINR(price)}
              </span>
              <span className="text-slate-500 text-xs md:text-sm font-medium">
                /mo
              </span>
            </div>
          </div>

          <Button className="w-full md:w-auto bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-5 md:py-6 rounded-md text-sm md:text-base font-bold transition-all active:scale-95 shadow-lg shadow-slate-200">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PGCard;
