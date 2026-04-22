import { model } from "mongoose";
import { BookingSchema } from "../schemas/booking.schema";

export const BookingModel = model("Booking", BookingSchema);
