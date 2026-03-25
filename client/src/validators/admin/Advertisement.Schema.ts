// validators/admin/Advertisement.Schema.ts
import { z } from "zod";

export const advertisementSchema = z.object({
  brandName: z.string().trim().min(3, "Brand name must be at least 3 characters"),
  startDate: z.string().min(1, "Start date is required").refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  }, "Start date cannot be in the past"),
  expiryDate: z.string().min(1, "Expiry date is required").refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  }, "Expiry date cannot be in the past"),
  brandLink: z.string().url("Please enter a valid URL (https://...)"),
  description: z.string().max(500, "Max 500 characters").optional().or(z.literal("")),
  bannerImages: z.array(z.any()).min(1, "At least one image is required").max(5, "Max 5 images allowed"),
}).refine((data) => new Date(data.expiryDate) > new Date(data.startDate), {
  message: "Expiry must be after start date",
  path: ["expiryDate"],
});

export type AdvertisementFormData = z.infer<typeof advertisementSchema>;