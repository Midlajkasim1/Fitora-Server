import { UpcomingSlotDTO } from "@/application/dto/slot/response/trainer-get-upcomingSlot.dto";
import { TrainerDashboardResponseDTO } from "@/application/dto/trainer/response/trainer-dashboard.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { TransactionType } from "@/domain/entities/transaction/transaction.entity";

export class GetTrainerDashboardUseCase implements IBaseUseCase<string, TrainerDashboardResponseDTO> {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _transactionRepository: ITransactionRepository
    ) { }
    async execute(trainerId: string): Promise<TrainerDashboardResponseDTO> {

        const totalClients = await this._slotRepository.getTotalClients(trainerId);
        
        const trainer = await this._trainerRepository.findByTrainerId(trainerId);
        const walletBalance = trainer?.walletBalance || 0;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const transactions = await this._transactionRepository.findByUserId(trainerId);
        const monthlyEarnings = transactions
            .filter(tx => tx.createdAt! >= startOfMonth && tx.type === TransactionType.SESSION_PAYOUT)
            .reduce((sum, tx) => sum + tx.amount, 0);

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
        upcomingSessions:mappedSessions,
        walletBalance,
        monthlyEarnings
    };

    }
}