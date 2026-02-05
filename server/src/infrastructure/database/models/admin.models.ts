import {  model } from "mongoose";
import { AdminSchema } from "../schemas/admin/admin.schema";

export const AdminModel = model("Admin", AdminSchema);

