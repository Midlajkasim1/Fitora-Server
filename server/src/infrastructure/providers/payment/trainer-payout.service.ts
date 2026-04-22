import { ITrainerPayoutService } from "@/domain/interfaces/services/trainer-payout.service.interface";
import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { TrainerPayoutModel } from "../../database/models/trainer-payout.model";
import { AttendanceStatus } from "@/domain/constants/session.constants";
import { Types } from "mongoose";

export class TrainerPayoutService implements ITrainerPayoutService {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async processSlotPayout(slotId: string): Promise<void> {
        const slot = await this._slotRepository.findById(slotId);
        if (!slot) return;

        const completedBookings = await this._bookingRepository.findBySlotId(slotId);
        const attendingCount = completedBookings.filter(b => b.attendanceStatus === AttendanceStatus.COMPLETED).length;

        if (attendingCount === 0) return;

        // Try to determine session value from a participant's plan
        let sessionValue = 200; // Default fallback if we can't determine
        
        try {
            const firstBooking = completedBookings.find(b => b.attendanceStatus === AttendanceStatus.COMPLETED);
            if (firstBooking) {
                const sub = await this._subscriptionRepository.findActiveByUserId(firstBooking.userId);
                if (sub) {
                    const plan = await this._subscriptionPlanRepository.findById(sub.planId);
                    if (plan && typeof plan.price === 'number' && plan.sessionCredits > 0) {
                        sessionValue = plan.price / plan.sessionCredits;
                    }
                }
            }
        } catch (error) {
            console.error("Error determining session value for payout:", error);
        }

        const totalSessionPot = sessionValue * attendingCount;
        const trainerAmount = totalSessionPot * 0.8; // 80% split
        const platformFee = totalSessionPot * 0.2; // 20% split

        await TrainerPayoutModel.findOneAndUpdate(
            { slotId: new Types.ObjectId(slotId) },
            {
                trainerId: new Types.ObjectId(slot.trainerId),
                amount: trainerAmount,
                platformFee: platformFee,
                totalAmount: totalSessionPot,
                status: "PENDING"
            },
            { upsert: true, new: true }
        );
    }
}
