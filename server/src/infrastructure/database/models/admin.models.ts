import { Schema, model } from "mongoose";

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
}, { timestamps: true });

export const AdminModel = model("Admin", AdminSchema);

