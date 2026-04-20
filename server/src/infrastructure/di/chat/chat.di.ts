import { ChatMessageMapper } from "@/infrastructure/database/mappers/chat-message.mapper";
import { ChatMessageRepository } from "@/infrastructure/database/repositories/chat-message.repository";
import { SendMessageUseCase } from "@/application/usecases/chat/send-message.usecase";
import { GetChatHistoryUseCase } from "@/application/usecases/chat/get-chat-history.usecase";
import { socketEmitterProxy } from "@/infrastructure/providers/socket/socket-emitter";
import { userRepositories } from "../user/user.repositories";

// ── Repository ────────────────────────────────────────────────────────────────
const chatMessageMapper = new ChatMessageMapper();
const chatMessageRepository = new ChatMessageRepository(chatMessageMapper);

// ── Use Cases ─────────────────────────────────────────────────────────────────
// SendMessageUseCase uses ISocketEmitter via proxy — no circular dependency.
const sendMessageUseCase = new SendMessageUseCase(
  chatMessageRepository,
  userRepositories.slotRepository,
  socketEmitterProxy
);

const getChatHistoryUseCase = new GetChatHistoryUseCase(chatMessageRepository);

// ── Exports ───────────────────────────────────────────────────────────────────
export const chatRepositories = {
  chatMessageRepository,
};

export const chatUseCases = {
  sendMessageUseCase,
  getChatHistoryUseCase,
};
