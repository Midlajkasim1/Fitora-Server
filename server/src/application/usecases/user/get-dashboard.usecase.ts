import { UserDashboardResponseDTO } from "@/application/dto/user/response/dashboard.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GenderType } from "@/domain/constants/auth.constants";
import { BMIStatus } from "@/domain/constants/health.metrics.constants";
import { AUTH_MESSAGES, HEALTH_METRICS_MESSAGES } from "@/domain/constants/messages.constants";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";

export class GetDashboardUseCase implements IBaseUseCase<string, UserDashboardResponseDTO> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _healthMetricsRepository: IHealthMetricsRepository,
        private readonly _slotRepository: ISlotRepository
    ) { }
    async execute(userId: string): Promise<UserDashboardResponseDTO> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const metrics = await this._healthMetricsRepository.findByUserId(userId);
        if (!metrics) {
            throw new Error(HEALTH_METRICS_MESSAGES.HEALT_METRICS_NOT_FOUND);
        }
        const upcoming = await this._slotRepository.getUserUpcomingSlots({ userId, skip: 0, limit: 1 });
        const heightBmi = metrics.height / 100;
        const bmiValue = parseFloat((metrics.weight / (heightBmi * heightBmi)).toFixed(1));
        let status = BMIStatus.NORMAL;
        if (bmiValue < 18.5) status = BMIStatus.UNDERWEIGHT;
        else if (bmiValue < 25) status = BMIStatus.NORMAL;
        else if (bmiValue < 30) status = BMIStatus.OVERWEIGHT;
        else status = BMIStatus.OBESE;
        const diff = metrics.weight - metrics.targetWeight;
        const progress = diff <= 0 ? 100 : Math.max(0, Math.round((metrics.targetWeight / metrics.weight) * 100)); const nextSession = upcoming.data.length > 0 ? {
            slotId: upcoming.data[0].slotId.toString(),
            startTime: upcoming.data[0].startTime,
            trainerName: upcoming.data[0].trainerName,
            type: upcoming.data[0].type
        } : null;
        const age = user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 0;
        const genderMul = user.gender?.toLowerCase() === GenderType.MALE ? 1 : 0;
        const bodyFatValue = parseFloat(((1.20 * bmiValue) + (0.23 * age) - (10.8 * genderMul) - 5.4).toFixed(1)
        ); return {
            welcomeName: `${user.firstName} ${user.lastName}`,
            metrics: {
                weight: metrics.weight,
                height: metrics.height,
                age: age,
                bodyFat: bodyFatValue,
                primaryGoal: metrics.primaryGoal
            },
            bmi: { value: bmiValue, status },
            weightLoss: {
                current: metrics.weight,
                target: metrics.targetWeight,
                progressPercentage: progress
            },
            monthlyProgress: [
                { day: "Mon", value: 30 }, { day: "Tue", value: 45 },
                { day: "Wed", value: 20 }, { day: "Thu", value: 80 },
                { day: "Fri", value: 50 }, { day: "Sat", value: 60 }
            ],
            nextSession
        };

    }
}