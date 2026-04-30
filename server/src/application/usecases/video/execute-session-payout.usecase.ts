import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { PayoutCalculator } from "@/domain/interfaces/services/payout-calculator.service";
import { TransactionEntity, TransactionType } from "@/domain/entities/transaction/transaction.entity";
import { AttendanceStatus, MIN_SUCCESS_THRESHOLD } from "@/domain/constants/session.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";
import { NotificationType } from "@/domain/constants/notification.constants";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ExecuteSessionPayoutRequestDTO } from "@/application/dto/video/request/execute-session-payout.dto";
import { ExecuteSessionPayoutResponseDTO } from "@/application/dto/video/response/execute-session-payout.dto";
import mongoose, { ClientSession } from "mongoose";
import { SLOT_MESSAGES, FINANCE_MESSAGES } from "@/domain/constants/messages.constants";


export class ExecuteSessionPayoutUseCase implements IBaseUseCase<ExecuteSessionPayoutRequestDTO, ExecuteSessionPayoutResponseDTO> {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _transactionRepository: ITransactionRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _notificationService: INotificationService
    ) {}

    async execute(dto: ExecuteSessionPayoutRequestDTO): Promise<ExecuteSessionPayoutResponseDTO> {
        const { slotId } = dto;
        
        const slot = await this._slotRepository.findById(slotId);
        if (!slot) {
            return { message: SLOT_MESSAGES.SLOT_NOT_FOUND };
        }

        const trainer = await this._userRepository.findById(slot.trainerId);
        const trainerName = trainer ? `${trainer.firstName} ${trainer.lastName}` : "Unknown Trainer";

        const mongoSession: ClientSession = await mongoose.startSession();
        mongoSession.startTransaction();

        try {
            const bookings = await this._bookingRepository.findBySlotId(slotId, mongoSession);
            
            const unpaidBookings = bookings.filter(b => {
                const isQualified = b.attendanceStatus === AttendanceStatus.COMPLETED || 
                                   (b.attendanceStatus === AttendanceStatus.ATTENDED && b.cumulativeMinutes * 60 >= MIN_SUCCESS_THRESHOLD);
                const isUnpaid    = !b.isPayoutProcessed;
                
                
                return isQualified && isUnpaid;
            });

            if (unpaidBookings.length === 0) {
                await mongoSession.commitTransaction();
                return { message: "No eligible bookings to process" };
            }


            let totalRevenuePaise = 0;
            for (const booking of unpaidBookings) {
                const sessionValuePaise = booking.creditValueAtPurchase > 0
                    ? booking.creditValueAtPurchase
                    : 20000;
                totalRevenuePaise += sessionValuePaise;
            }

            const { trainerAmountPaise, platformFeePaise } = PayoutCalculator.calculateSplit({ sessionValueInPaise: totalRevenuePaise });
            const trainerAmountRupees = PayoutCalculator.toRupees({ paise: trainerAmountPaise });
            const platformFeeRupees   = PayoutCalculator.toRupees({ paise: platformFeePaise });


            await this._trainerRepository.updateWalletBalance(slot.trainerId, trainerAmountRupees, mongoSession);

            const payoutTx = TransactionEntity.create({
                userId: slot.trainerId,
                entityName: trainerName,
                amount: trainerAmountRupees,
                type: TransactionType.SESSION_PAYOUT,
                description: `Payout: Session (${unpaidBookings.length} participant${unpaidBookings.length > 1 ? "s" : ""})`,
                referenceId: slotId
            });
            await this._transactionRepository.create(payoutTx, mongoSession);

            const commissionTx = TransactionEntity.create({
                entityName: "Fitora Platform",
                amount: platformFeeRupees,
                type: TransactionType.PLATFORM_COMMISSION,
                description: "Commission: Session",
                referenceId: slotId
            });
            await this._transactionRepository.create(commissionTx, mongoSession);

            for (const booking of unpaidBookings) {
                await this._bookingRepository.updateAttendance(booking.id!, {
                    isPayoutProcessed: true
                }, mongoSession);
            }

            await mongoSession.commitTransaction();


            try {
                await this._notificationService.notify(slot.trainerId, {
                    title: "Wallet Credited! 💰",
                    message: `You've received ₹${trainerAmountRupees} for completing session with ${unpaidBookings.length} participant${unpaidBookings.length > 1 ? "s" : ""}.`,
                    type: NotificationType.WALLET_CREDITED
                });
            } catch {
                // Silently handle notification failures to avoid failing the payout process
            }

            return { message: FINANCE_MESSAGES.PAYOUT_PROCESSED(trainerAmountRupees) };

        } catch (error) {
            await mongoSession.abortTransaction();
            throw error;
        } finally {
            mongoSession.endSession();
        }
    }
}
