import { model } from "mongoose";
import { SlotSchema } from "../schemas/slot.schema";



export const SlotModel =  model("Slot",SlotSchema);
