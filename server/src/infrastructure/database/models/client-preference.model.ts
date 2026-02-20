import { model } from "mongoose";
import { IClientPreferenceDocument } from "../interfaces/client-preference-document.interface";
import { ClientPreferenceSchema } from "../schemas/user/client-preference.schema";

export const ClientPreferenceModel = model<IClientPreferenceDocument>(
  "ClientPreference", 
  ClientPreferenceSchema,
  "client_preferences"
);