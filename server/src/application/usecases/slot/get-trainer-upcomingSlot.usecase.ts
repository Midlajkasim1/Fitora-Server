import { GetTrainerUpcomingSlotRequestDTO } from "@/application/dto/slot/request/trainer-get-upcomingSlot.dto";
import { TrainerUpcomingResponseDTO, UpcomingSlotDTO } from "@/application/dto/slot/response/trainer-get-upcomingSlot.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";

export class GetTrainerUpcomingSlotsUseCase implements IBaseUseCase<GetTrainerUpcomingSlotRequestDTO, TrainerUpcomingResponseDTO> {
  constructor(private readonly _slotRepository: ISlotRepository
    
  ) {}

  async execute(dto: GetTrainerUpcomingSlotRequestDTO): Promise<TrainerUpcomingResponseDTO> {
    const skip = (dto.page - 1) * dto.limit;

    const result = await this._slotRepository.getTrainerUpcomingSlots({
      trainerId: dto.trainerId,
      skip,
      limit: dto.limit,
    });

    const mappedSlots: UpcomingSlotDTO[] = result.data.map((slot) => ({
      slotId: slot.slotId.toString(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      type: slot.type,
      status: slot.status,
      capacity: slot.capacity,
      bookedCount: slot.bookedCount
    }));

    return {
      slots: mappedSlots,
      total: result.total,
    };
  }
}