import { z } from "zod";

// types/trainer.types.ts
export const CreateSlotSchema = z.object({
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date format",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date format",
  }),
  type: z.enum(["one_on_one", "group"]),
  capacity: z.number().min(1),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type CreateSlotInput = z.infer<typeof CreateSlotSchema>;