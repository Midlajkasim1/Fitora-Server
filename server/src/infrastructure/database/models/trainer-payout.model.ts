import { model } from "mongoose";
import { TrainerPayoutSchema } from "../schemas/trainer-payout.schema";

export const TrainerPayoutModel = model("TrainerPayout", TrainerPayoutSchema);
