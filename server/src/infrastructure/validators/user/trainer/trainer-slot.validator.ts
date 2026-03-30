import { z } from "zod";
import { SessionType } from "@/domain/constants/session.constants";

export const SlotSchema = z
  .object({
    startTime: z.string().datetime({ message: "Invalid start time format" }),
    endTime: z.string().datetime({ message: "Invalid end time format" }),
    
    type: z.nativeEnum(SessionType, { 
      message: "Invalid session type" 
    }),

    capacity: z.coerce
      .number()
      .min(1, "Capacity must be at least 1")
      .max(50, "Capacity cannot exceed 50")
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      return start > new Date();
    },
    {
      message: "Session start time must be in the future",
      path: ["startTime"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const durationMs = end.getTime() - start.getTime();
      const durationMin = durationMs / (1000 * 60);

      return durationMin === 60;
    },
    {
      message: "Session duration must be exactly 1 hour",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      if (data.type === SessionType.ONE_ON_ONE && data.capacity && data.capacity !== 1) {
        return false;
      }
      return true;
    },
    {
      message: "One-on-One sessions must have a capacity of 1",
      path: ["capacity"],
    }
  );