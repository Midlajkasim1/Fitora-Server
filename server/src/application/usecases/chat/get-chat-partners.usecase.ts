import { ChatPartnerResponseDTO, GetChatPartnersResponseDTO } from "@/application/dto/chat/response/chat-partners-response.dto";
import { GetChatPartnersRequestDTO } from "@/application/dto/chat/request/get-chat-partners.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IChatMessageRepository } from "@/domain/interfaces/repositories/chat-message.repository";

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class GetChatPartnersUseCase
  implements IBaseUseCase<GetChatPartnersRequestDTO, GetChatPartnersResponseDTO>
{
  constructor(
    private readonly _slotRepository: ISlotRepository,
    private readonly _chatRepository: IChatMessageRepository
  ) {}

  async execute(dto: GetChatPartnersRequestDTO): Promise<GetChatPartnersResponseDTO> {
    // Grace-period lower bound: any session that ended >= (now - 24h) qualifies
    const gracePeriodLimit = new Date(Date.now() - GRACE_PERIOD_MS);

    let chatPartners;
    if (dto.role === "trainer") {
      chatPartners = await this._slotRepository.findActiveChatPartnersForTrainer(
        dto.userId,
        gracePeriodLimit
      );
    } else {
      chatPartners = await this._slotRepository.findActiveChatPartners(
        dto.userId,
        gracePeriodLimit
      );
    }

    const partners: ChatPartnerResponseDTO[] = await Promise.all(
      chatPartners.map(async (partner) => {
        const hasUnread = await this._chatRepository.hasUnread(
          partner.id, // sender is the partner
          dto.userId // receiver is the current user
        );

        return {
          id: partner.id,
          name: partner.name,
          profileImage: partner.profileImage,
          isChatEnabled: true,
          hasUnread,
        };
      })
    );

    return { partners };
  }
}
