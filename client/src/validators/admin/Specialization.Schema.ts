import z from "zod";

export const specializationSchema = z
  .object({
    mode: z.enum(["create", "edit"]),
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(300, "Description cannot exceed 300 characters"),
    image: z
      .any() 
      .optional()
      .refine((file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024), "Max 5MB")
      .refine(
        (file) => !file || (file instanceof File && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)),
        "Only JPG/PNG allowed"
      ),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "create" && !(data.image instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image is required for new specializations",
        path: ["image"],
      });
    }
  });

export type SpecializationFormData = z.infer<typeof specializationSchema>;