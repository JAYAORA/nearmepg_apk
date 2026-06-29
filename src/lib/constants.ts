export const CITIES = [
  { name: "Chennai", emoji: "🌴", tag: "OMR & Adyar" },
  { name: "Hyderabad", emoji: "🍛", tag: "Hitech City & Banjara Hills" },
  { name: "Mumbai", emoji: "🌊", tag: "BKC, Powai & Bandra" },
  { name: "Bangalore", emoji: "☕", tag: "Koramangala & Indiranagar" },
] as const;

export type City = (typeof CITIES)[number]["name"];
