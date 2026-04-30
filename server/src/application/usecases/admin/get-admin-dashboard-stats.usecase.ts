import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IPaymentRepository } from "@/domain/interfaces/repositories/payment.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { GetAdminDashboardStatsResponseDTO } from "@/application/dto/admin/response/get-admin-dashboard-stats.dto";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { UserRole } from "@/domain/constants/auth.constants";

export class GetAdminDashboardStatsUseCase implements IBaseUseCase<number, GetAdminDashboardStatsResponseDTO> {
    constructor(
        private readonly _paymentRepository: IPaymentRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _slotRepository: ISlotRepository
    ) {}

    async execute(year: number): Promise<GetAdminDashboardStatsResponseDTO> {
        const [
            financialStats,
            totalSubscriptions,
            planStats,
            registrationStats,
            totalUsers,
            totalTrainers,
            activeSessions
        ] = await Promise.all([
            this._paymentRepository.getFinancialStats(year),
            this._subscriptionRepository.countActiveSubscriptions(),
            this._subscriptionRepository.getActiveSubscriptionCountsByPlan(),
            this._userRepository.getMonthlyRegistrationStats(year),
            this._userRepository.countTotalUsers(),
            this._userRepository.countByRole(UserRole.TRAINER),
            this._slotRepository.countActiveSessions()
        ]);

        const totalRevenue = financialStats.reduce((sum, item) => sum + item.totalRevenue, 0);

        return {
            statsCards: {
                totalRevenue,
                totalSubscriptions,
                totalUsers,
                totalTrainers,
                activeSessions,
                planStats
            },
            financialStats,
            registrationStats
        };
    }
}
