import { model } from "mongoose";
import { UserSchema } from "../schemas/user/user.schema";

export const UserModel = model("User", UserSchema);
