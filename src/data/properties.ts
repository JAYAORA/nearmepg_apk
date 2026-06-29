// src/data/properties.ts

import { PropertyCardProps } from "@/components/home/PropertyCard";



export const featuredProperties: PropertyCardProps[] = [
  {
    id: "1",

    slug: "sri-sai-men-pg-velachery",

    name: "Sri Sai Men's PG",

    propertyType: "pg",

    city: "Chennai",

    area: "Velachery",

    thumbnail:
      "/images/properties/sri-sai-pg.jpg",

    rating: 4.8,

    reviewCount: 142,

    price: 7500,

    pricingUnit: "month",

    gender: "men",

    verified: true,

    amenities: [
      "WiFi",
      "Food",
      "Laundry",
      "AC",
    ],
  },

  {
    id: "2",

    slug: "grand-residency-adyar",

    name: "Grand Residency",

    propertyType: "hotel",

    city: "Chennai",

    area: "Adyar",

    thumbnail:
      "/images/properties/grand-residency.jpg",

    rating: 4.7,

    reviewCount: 310,

    price: 2300,

    pricingUnit: "night",

    verified: true,

    amenities: [
      "WiFi",
      "Parking",
      "Breakfast",
    ],
  },
];