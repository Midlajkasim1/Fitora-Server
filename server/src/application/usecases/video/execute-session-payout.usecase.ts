import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { PayoutCalculator } from "@/domain/services/payout-calculator.service";
import { TransactionEntity, TransactionType } from "@/domain/entities/transaction/transaction.entity";
import { AttendanceStatus } from "@/domain/constants/session.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import mongoose from "mongoose";

export class ExecuteSessionPayoutUseCase {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _transactionRepository: ITransactionRepository,
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(slotId: string): Promise<void> {
        const slot = await this._slotRepository.findById(slotId);
        if (!slot) {
            throw new Error("Slot not found");
        }

        const trainer = await this._userRepository.findById(slot.trainerId);
        const trainerName = trainer ? `${trainer.firstName} ${trainer.lastName}` : "Unknown Trainer";

        const bookings = await this._bookingRepository.findBySlotId(slotId);
        const completedBookings = bookings.filter(b => b.attendanceStatus === AttendanceStatus.COMPLETED);

        if (completedBookings.length === 0) {
            return; 
        }

        let sessionValue = 0;
        const firstAttendingParticipant = completedBookings[0];
        const subscription = await this._subscriptionRepository.findActiveByUserId(firstAttendingParticipant.userId);
        
        if (subscription) {
            const plan = await this._subscriptionPlanRepository.findById(subscription.planId);
            if (plan && plan.sessionCredits > 0) {
                sessionValue = plan.price / plan.sessionCredits;
            }
        }

        const totalSessionValue = sessionValue * completedBookings.length;
        const { trainerAmount, platformFee } = PayoutCalculator.calculateSplit(totalSessionValue);

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Credit Trainer's Wallet
            await this._trainerRepository.updateWalletBalance(slot.trainerId, trainerAmount);

            // 2. Create Immutable Payout Transaction (Outflow: Negative)
            const payoutTransaction = TransactionEntity.create({
                userId: slot.trainerId,
                entityName: trainerName,
                amount: -trainerAmount,
                type: TransactionType.SESSION_PAYOUT,
                description: `Payout for session ${slotId} (${completedBookings.length} participants)`,
                referenceId: slotId
            });
            await this._transactionRepository.create(payoutTransaction);

            // 3. Create Platform Commission Transaction (Inflow: Positive)
            const commissionTransaction = TransactionEntity.create({
                entityName: "Fitora Platform",
                amount: platformFee,
                type: TransactionType.PLATFORM_COMMISSION,
                description: `Commission from session ${slotId}`,
                referenceId: slotId
            });
            await this._transactionRepository.create(commissionTransaction);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.error("Financial transaction failed, aborted.", error);
            throw error;
        } finally {
            session.endSession();
        }
    }
}
