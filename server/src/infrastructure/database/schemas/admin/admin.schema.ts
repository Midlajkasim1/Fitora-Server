import { Schema } from "mongoose";


export const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
}, { timestamps: true });