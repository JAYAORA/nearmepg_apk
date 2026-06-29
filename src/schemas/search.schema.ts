import { z } from "zod";

const searchSchema = z.object({
  city: z.string().min(1, "City is required"),
  query: z
    .string()
    .trim()
    .min(2, "Search must be at least 2 characters")
    .max(50, "Search is too long"),
});

export { searchSchema };
