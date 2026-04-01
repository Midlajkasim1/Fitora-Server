import { z } from "zod";

export const weightUpdateSchema = z.object({
  weight: z.preprocess(
    (val) => Number(val), 
    z.number()
      .positive("Weight must be a positive number")
      .min(20, "Weight is too low")
      .max(500, "Weight is too high")
  )
});

export type WeightUpdateInput = z.infer<typeof weightUpdateSchema>;