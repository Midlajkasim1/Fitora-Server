import { model } from "mongoose";
import {ISpecializationDocument } from "../interfaces/specialization-interface";
import { SpecializationSchema } from "../schemas/specialization.schema";



export const SpecializationModel = model<ISpecializationDocument>(
    "Specialization",
    SpecializationSchema

);