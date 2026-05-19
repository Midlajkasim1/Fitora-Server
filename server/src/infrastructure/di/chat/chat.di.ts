import { GetChatHistoryUseCase } from "@/application/usecases/chat/get.chat.history.usecase";
import { SendMessageUseCase } from "@/application/usecases/chat/send.message.usecase";
import { ChatMessageMapper } from "@/infrastructure/database/mappers/chat.message.mapper";
import { ChatMessageRepository } from "@/infrastructure/database/repositories/chat-message.repository";
import { socketEmitterProxy } from "@/infrastructure/providers/socket/socket-emitter";
import { userRepositories } from "../user/user.repositories";

const chatMessageMapper = new ChatMessageMapper();
const chatMessageRepository = new ChatMessageRepository(chatMessageMapper);


const sendMessageUseCase = new SendMessageUseCase(
  chatMessageRepository,
  userRepositories.slotRepository,
  socketEmitterProxy
);

const getChatHistoryUseCase = new GetChatHistoryUseCase(chatMessageRepository);

export const chatRepositories = {
  chatMessageRepository,
};

export const chatUseCases = {
  sendMessageUseCase,
  getChatHistoryUseCase,
};
