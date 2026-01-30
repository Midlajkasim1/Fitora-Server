import { model } from "mongoose";
import { ITrainerDetailsDocument } from "../interfaces/trainer-details-document.interface";
import { TrainerDetailsSchema } from "../schemas/trainer-details.schema";

export const TrainerDetailsModel = model<ITrainerDetailsDocument>(
  "TrainerDetails", 
  TrainerDetailsSchema, 
  "trainer_details"
);