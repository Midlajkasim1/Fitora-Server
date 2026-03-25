import { z } from "zod";

export const CreateAdvertisementSchema = z.object({
  brandName: z.string().min(2, "Brand name is too short").trim(),
  
  startDate: z.coerce.date({
    message: "Invalid start date format",
  }),

  expiryDate: z.coerce.date({
    message: "Invalid expiry date format",
  }),

  brandLink: z.string().url("Brand link must be a valid URL"),
  description: z.string().optional(),
}).refine((data) => data.expiryDate > data.startDate, {
  message: "Expiry date must be after start date",
  path: ["expiryDate"], 
});

