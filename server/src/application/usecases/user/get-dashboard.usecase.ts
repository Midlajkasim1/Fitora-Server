import { UserDashboardResponseDTO } from "@/application/dto/user/response/dashboard.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GenderType } from "@/domain/constants/auth.constants";
import { SlotStatus } from "@/domain/constants/session.constants";
import { BMIStatus } from "@/domain/constants/health.metrics.constants";
import { AUTH_MESSAGES, HEALTH_METRICS_MESSAGES } from "@/domain/constants/messages.constants";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";

export class GetDashboardUseCase implements IBaseUseCase<string, UserDashboardResponseDTO> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _healthMetricsRepository: IHealthMetricsRepository,
        private readonly _slotRepository: ISlotRepository,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) { }

    async execute(userId: string): Promise<UserDashboardResponseDTO> {
        const user = await this._userRepository.findById(userId);
        if (!user) throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);

        const metrics = await this._healthMetricsRepository.findByUserId(userId);
        if (!metrics) throw new Error(HEALTH_METRICS_MESSAGES.HEALT_METRICS_NOT_FOUND);

        const upcoming = await this._slotRepository.getUserUpcomingSlots({ userId, skip: 0, limit: 5 });

        const heightBmi = metrics.height / 100;
        const bmiValue = parseFloat((metrics.weight / (heightBmi * heightBmi)).toFixed(1));

        let status = BMIStatus.NORMAL;
        if (bmiValue < 18.5) status = BMIStatus.UNDERWEIGHT;
        else if (bmiValue < 25) status = BMIStatus.NORMAL;
        else if (bmiValue < 30) status = BMIStatus.OVERWEIGHT;
        else status = BMIStatus.OBESE;

        const current = metrics.weight;
        const target = metrics.targetWeight;

        let progressPercentage = 0;
        if (target > 0) {
            const isLosing = current > target;
            progressPercentage = isLosing ? (target / current) * 100 : (current / target) * 100;
            progressPercentage = Math.min(Math.max(Math.round(progressPercentage), 0), 100);
        }

        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const lastUpdate = metrics.updatedAt ? new Date(metrics.updatedAt).getTime() : 0;
        const showWeightModal = (Date.now() - lastUpdate) > SEVEN_DAYS_MS;

        const age = user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 0;
        const genderMul = user.gender?.toLowerCase() === GenderType.MALE ? 1 : 0;
        const bodyFatValue = parseFloat(((1.20 * bmiValue) + (0.23 * age) - (10.8 * genderMul) - 5.4).toFixed(1));

        const nextSessionData = upcoming.data.find(slot => slot.status !== SlotStatus.COMPLETED);
        const nextSession = nextSessionData ? {
            slotId: nextSessionData.slotId.toString(),
            trainerId: nextSessionData.trainerId.toString(),
            startTime: nextSessionData.startTime,
            trainerName: nextSessionData.trainerName,
            type: nextSessionData.type
        } : null;

        const [monthlyProgress, sessionsPerDay, activityStats, activeSubscription] = await Promise.all([
            this._bookingRepository.getUserDailyProgress(userId, 7),
            this._bookingRepository.getUserSessionsPerDay(userId, 7),
            this._bookingRepository.getUserActivityStats(userId),
            this._subscriptionRepository.findActiveByUserId(userId)
        ]);

        let totalSubscriptionSessions = 100; // Default fallback
        let sessionsLeft = 100;

        if (activeSubscription) {
            const plan = await this._subscriptionPlanRepository.findById(activeSubscription.planId);
            if (plan) {
                totalSubscriptionSessions = plan.sessionCredits;
                sessionsLeft = Math.max(plan.sessionCredits - activeSubscription.usedCredit, 0);
            }
        }

        return {
            welcomeName: `${user.firstName} ${user.lastName}`,
            showWeightModal,
            metrics: {
                weight: metrics.weight,
                height: metrics.height,
                age,
                bodyFat: bodyFatValue,
                primaryGoal: metrics.primaryGoal
            },
            bmi: { value: bmiValue, status },
            weightLoss: { current: metrics.weight, target: metrics.targetWeight, progressPercentage },
            monthlyProgress,
            nextSession,
            sessionsPerDay,
            totalSessionsAttended: activityStats.totalSessionsAttended,
            totalSubscriptionSessions,
            sessionsLeft
        };
    }
}