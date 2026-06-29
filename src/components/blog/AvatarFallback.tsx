import React from "react";

interface AvatarFallbackProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const COLORS = [
  "bg-amber-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

export function AvatarFallback({ name, size = "md" }: AvatarFallbackProps) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  
  // Use sum of char codes to pick a consistent color
  const colorIndex = name
    ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % COLORS.length
    : 0;
  
  const bgColor = COLORS[colorIndex];

  const sizeClasses = {
    sm: "w-5 h-5 text-[10px]",
    md: "w-7 h-7 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${bgColor}`}
    >
      {initial}
    </div>
  );
}
