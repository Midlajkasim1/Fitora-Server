import { model } from "mongoose";
import { AdvertisementSchema } from "../schemas/advertisement.schema";


export const AdvertisementModel = model("Advertisement",AdvertisementSchema);