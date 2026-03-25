import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";
import { z } from "zod";

export const UpdateAdvertisementSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Advertisement ID"),

  brandName: z.string().min(2, "Brand name is too short").trim().optional(),
  
  startDate: z.coerce.date({
    message: "Invalid start date format",
  }).optional(),

  expiryDate: z.coerce.date({
    message: "Invalid expiry date format",
  }).optional(),

  brandLink: z.string().url("Brand link must be a valid URL").optional(),
  
  description: z.string().max(500, "Description is too long").optional(),
  
status: z.nativeEnum(AdvertisementStatus).optional(),
}).refine((data) => {
  if (data.startDate && data.expiryDate) {
    return data.expiryDate > data.startDate;
  }
  return true;
}, {
  message: "Expiry date must be after start date",
  path: ["expiryDate"], 
});

export type UpdateAdvertisementInput = z.infer<typeof UpdateAdvertisementSchema>;