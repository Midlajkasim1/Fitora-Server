import { model } from "mongoose";
import { ChatMessageSchema } from "../schemas/chat-message.schema";
import { IChatMessageDocument } from "../interfaces/chat-message.document";

export const ChatMessageModel = model<IChatMessageDocument>("ChatMessage", ChatMessageSchema);
