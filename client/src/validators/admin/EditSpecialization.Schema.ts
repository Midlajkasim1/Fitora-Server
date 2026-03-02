import z from "zod";

export const editSpecializationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters")
    .optional(),

  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      {
        message: "Only JPG, JPEG, or PNG allowed",
      }
    ),
});
export type EditSpecializationFormData =
  z.infer<typeof editSpecializationSchema>;