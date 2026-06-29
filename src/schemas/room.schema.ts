import { z } from "zod";

export const bedSchema = z.object({
  id: z.string().min(1, "Bed id is required"),
  label: z.string().optional(),
  status: z.enum(["available", "reserved", "occupied"]).default("available"),
  yaw: z.coerce.number().optional(),
  pitch: z.coerce.number().optional(),
  reservedAt: z.string().nullable().optional(),
});

export const roomSchema = z.object({
  id: z
    .string()
    .min(1, "Room id is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Room id must be alphanumeric with hyphens/underscores"),
  hostel_slug: z.string().min(1, "hostel_slug is required"),
  name: z.string().optional(),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  per_day_price: z.coerce.number().min(0).default(0),
  sharing: z.coerce
    .number()
    .int()
    .min(1, "Sharing must be at least 1")
    .max(10, "Sharing cannot exceed 10"),
  hasAC: z.boolean().default(false),
  available: z.boolean().default(true),
  floor: z.coerce.number().int().min(0).optional(),
  mandatory_min_stay: z.coerce.number().min(0).default(0),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
  panoramaUrl: z.string().url("Panorama URL must be a valid URL").optional(),
  beds: z.array(bedSchema).default([]),
});

export const roomUpdateSchema = roomSchema.partial().omit({ id: true, hostel_slug: true });
export const bedUpdateSchema = bedSchema.partial().omit({ id: true });
