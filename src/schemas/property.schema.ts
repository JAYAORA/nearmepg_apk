import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(10, "Description must be at least 10 characters"),

  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),
  location: z.string().min(5, "Full location/address is required"),
  googleMapsLink: z.string().url("Invalid Google Maps URL").optional(),

  propertyType: z.enum(["pg", "hotel", "coliving"]),

  gender: z.enum(["men", "women", "coed"]).optional(),

  price: z.coerce.number().min(1, "Price must be greater than 0"),

  pricingUnit: z.enum(["month", "night"]),

  rating: z.coerce.number().min(0).max(5).default(0),
  reviewCount: z.coerce.number().min(0).default(0),
  verified: z.boolean().default(false),

  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
  amenities: z.array(z.string()).default([]),

  owner_mail: z.string().email("Invalid owner email address"),
  owner_contact: z.coerce
    .number()
    .min(1000000000, "Invalid contact number — must be 10 digits")
    .max(9999999999, "Invalid contact number — must be 10 digits")
    .optional(),
});

export const propertyUpdateSchema = propertySchema.partial();
