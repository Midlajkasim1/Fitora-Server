import { z } from "zod";

export const CreateSlotSchema = z.object({
  type: z.enum(["one_on_one", "group"]),
  capacity: z.number()
    .min(1, "Capacity must be at least 1")
    .max(20, "Maximum capacity is 20"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

export type CreateSlotFormData = z.infer<typeof CreateSlotSchema>;