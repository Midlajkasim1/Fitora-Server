import { UpcomingSlotDTO } from "@/application/dto/slot/response/trainer-get-upcomingSlot.dto";
import { TrainerDashboardResponseDTO } from "@/application/dto/trainer/response/trainer-dashboard.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";

export class GetTrainerDashboardUseCase implements IBaseUseCase<string, TrainerDashboardResponseDTO> {
    constructor(
        private readonly _slotRepository: ISlotRepository
    ) { }
    async execute(trainerId: string): Promise<TrainerDashboardResponseDTO> {

        const totalClients = await this._slotRepository.getTotalClients(trainerId);
        const upcomingSessions = await this._slotRepository.getTrainerUpcomingSlots({
            trainerId,
            skip: 0,
            limit: 3
        });
        const mappedSessions: UpcomingSlotDTO[] = upcomingSessions.data.map((slot) => ({
            slotId: slot.slotId.toString(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            type: slot.type,
            status: slot.status,
            capacity: slot.capacity,
            bookedCount: slot.bookedCount
        }));
    return {
        totalClients,
        upcomingSessions:mappedSessions
    };

    }
}