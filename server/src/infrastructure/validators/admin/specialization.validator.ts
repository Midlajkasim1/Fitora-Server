import {z} from "zod";

export const SpecializationSchema = z.object({
   name : z.string().min(2,"name is required"),
   description:z.string().min(10,"description is too short!"),
});