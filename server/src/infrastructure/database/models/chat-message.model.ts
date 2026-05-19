import { model } from "mongoose";
import { IChatMessageDocument } from "../interfaces/chat.message.document";
import { ChatMessageSchema } from "../schemas/chat-message.schema";

export const ChatMessageModel = model<IChatMessageDocument>("ChatMessage", ChatMessageSchema);
