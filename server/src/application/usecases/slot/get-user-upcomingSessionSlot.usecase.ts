import { GetUserUpcomingRequestDTO } from "@/application/dto/slot/request/user-get-upcomingSlot.dto";
import { UserUpcomingResponseDTO, UserUpcomingSlotDTO } from "@/application/dto/slot/response/user-upcomingSlot.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";



export class GetUserUpcomingSessionSlotsUseCase implements IBaseUseCase<GetUserUpcomingRequestDTO, UserUpcomingResponseDTO> {
    constructor(
        private readonly _slotRepository: ISlotRepository
    ) { }
    async execute(dto: GetUserUpcomingRequestDTO): Promise<UserUpcomingResponseDTO> {

        const skip = (dto.page - 1) * dto.limit;
        const result = await this._slotRepository.getUserUpcomingSlots({
            userId: dto.userId,
            skip,
            limit: dto.limit
        });
        const mappedSessions: UserUpcomingSlotDTO[] = result.data.map(session => ({
            slotId: session.slotId.toString(),
            trainerId: session.trainerId.toString(),
            startTime: session.startTime,
            endTime: session.endTime,
            type: session.type,
            status:session.status,
            trainerName: session.trainerName,
            trainerProfile: session.trainerProfile
        }));
        return {
            sessions:mappedSessions,
            total:result.total
        };

    }
}