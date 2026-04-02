import { model } from "mongoose";
import { NotificationSchema } from "../schemas/notification.schema";

export const NotificationModel = model("Notification", NotificationSchema);