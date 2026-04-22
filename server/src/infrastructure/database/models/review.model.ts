import mongoose from "mongoose";
import { ReviewSchema } from "../schemas/review/review.schema";

export const ReviewModel = mongoose.model("Review", ReviewSchema, "reviews");
