/**
 * Demo hotel data — mirrors the real Property & Room API contract exactly.
 * Swap these out for real API calls once the backend supports hotels.
 *
 * Visit /properties/grand-stay-hyderabad to see the hotel experience.
 */

import type { Property, Room } from "@/types/property";

// ─── Demo 360° panorama URLs (freely available equirectangular images) ────────

const PANO_LOBBY =
  "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg";
const PANO_STANDARD =
  "https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg";
// Reuse same demo panoramas for other rooms (replace with real ones)
const PANO_DELUXE = PANO_LOBBY;
const PANO_SUITE = PANO_STANDARD;

// ─── Demo Hotel ───────────────────────────────────────────────────────────────

export const DEMO_HOTEL: Property = {
  id: "demo-hotel-001",
  slug: "grand-stay-hyderabad",
  name: "Grand Stay Hyderabad",
  propertyType: "hotel",
  city: "Hyderabad",
  area: "Banjara Hills",
  location: "Road No. 12, Banjara Hills, Hyderabad, Telangana 500034",
  thumbnail:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
  ],
  rating: 4.6,
  reviewCount: 312,
  price: 3200,
  pricingUnit: "night",
  verified: true,
  amenities: [
    "WiFi",
    "AC",
    "Parking",
    "Gym",
    "Breakfast",
    "TV",
    "CCTV",
    "Security",
    "Housekeeping",
    "24/7 Water",
    "Power",
    "Locker",
  ],
  gender: "coed",
  description:
    "Experience refined comfort at Grand Stay Hyderabad, nestled in the heart of Banjara Hills. Our boutique hotel blends contemporary design with warm Hyderabadi hospitality. Whether you're here for business or leisure, enjoy impeccably furnished rooms, a state-of-the-art gym, and a rooftop breakfast lounge with panoramic city views.",
  googleMapsLink:
    "https://maps.google.com/?q=Banjara+Hills+Hyderabad",
};

// ─── Demo Rooms ───────────────────────────────────────────────────────────────

export const DEMO_HOTEL_ROOMS: Room[] = [
  {
    id: "room-std-001",
    hostel_slug: "grand-stay-hyderabad",
    name: "Standard Room",
    price: 3200,
    sharing: 2, // max occupancy for hotel rooms
    hasAC: true,
    available: true,
    floor: 2,
    panoramaUrl: PANO_STANDARD,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ],
    beds: [], // hotels book the whole room — no bed-level selection
    // Extra hotel-specific fields (optional, stored as free fields)
    ...(({
      description:
        "A cosy and well-appointed room for solo or couple travellers. Features a queen bed, work desk, 43″ Smart TV, and city-view window.",
      maxGuests: 2,
      amenities: ["WiFi", "AC", "TV", "Safe", "Mini Fridge", "Desk"],
      bedType: "Queen",
    } as any)),
  },
  {
    id: "room-dlx-001",
    hostel_slug: "grand-stay-hyderabad",
    name: "Deluxe Room",
    price: 4800,
    sharing: 2,
    hasAC: true,
    available: true,
    floor: 3,
    panoramaUrl: PANO_DELUXE,
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ],
    beds: [],
    ...(({
      description:
        "Spacious deluxe room with premium furnishings, a king-size bed, separate seating area, and floor-to-ceiling windows overlooking Banjara Hills.",
      maxGuests: 2,
      amenities: ["WiFi", "AC", "TV", "Safe", "Mini Bar", "Bathrobe", "Desk"],
      bedType: "King",
    } as any)),
  },
  {
    id: "room-suite-001",
    hostel_slug: "grand-stay-hyderabad",
    name: "Luxury Suite",
    price: 8500,
    sharing: 3,
    hasAC: true,
    available: true,
    floor: 5,
    panoramaUrl: PANO_SUITE,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    ],
    beds: [],
    ...(({
      description:
        "Our signature suite offers a separate living room, king bed, Jacuzzi bathtub, and a private balcony with panoramic city views. Perfect for anniversaries or executive stays.",
      maxGuests: 3,
      amenities: [
        "WiFi",
        "AC",
        "TV",
        "Safe",
        "Mini Bar",
        "Jacuzzi",
        "Balcony",
        "Bathrobe",
        "Butler Service",
      ],
      bedType: "King",
    } as any)),
  },
  {
    id: "room-exec-001",
    hostel_slug: "grand-stay-hyderabad",
    name: "Executive Suite",
    price: 12000,
    sharing: 4,
    hasAC: true,
    available: false, // sold out — to show unavailable state
    floor: 6,
    panoramaUrl: PANO_LOBBY,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      "https://images.unsplash.com/photo-1574643156929-51f9076ece75?w=800&q=80",
    ],
    beds: [],
    ...(({
      description:
        "The pinnacle of luxury — two bedrooms, a private dining area, dedicated concierge, and access to the rooftop lounge. Ideal for families or VIP delegations.",
      maxGuests: 4,
      amenities: [
        "WiFi",
        "AC",
        "TV",
        "Safe",
        "Mini Bar",
        "Jacuzzi",
        "Balcony",
        "Butler Service",
        "Private Dining",
        "Concierge",
      ],
      bedType: "Twin King",
    } as any)),
  },
];

// ─── Demo slugs set (for O(1) lookup) ────────────────────────────────────────

export const DEMO_SLUGS = new Set(["grand-stay-hyderabad"]);

export function getDemoProperty(slug: string): Property | null {
  if (slug === "grand-stay-hyderabad") return DEMO_HOTEL;
  return null;
}

export function getDemoRooms(slug: string): Room[] | null {
  if (slug === "grand-stay-hyderabad") return DEMO_HOTEL_ROOMS;
  return null;
}
