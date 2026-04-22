import { ITransactionRepository, IFinancialOverview } from "@/domain/interfaces/repositories/transaction.repository";
import { FinanceAnalyticsService } from "@/domain/services/finance-analytics.service";
import { TransactionType } from "@/domain/entities/transaction/transaction.entity";

export class GetFinanceOverviewUseCase {
    constructor(private readonly _transactionRepository: ITransactionRepository) {}

    async execute() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const [currentPeriodData, lastPeriodData] = await Promise.all([
            this._transactionRepository.getFinancialOverview(startOfMonth, endOfMonth),
            this._transactionRepository.getFinancialOverview(lastMonthStart, lastMonthEnd)
        ]);

        const current = currentPeriodData[0] || { totals: [], subscriptionSplit: [], chartData: [] };
        const previous = lastPeriodData[0] || { totals: [], subscriptionSplit: [], chartData: [] };

        // Process Totals
        const getSum = (facet: IFinancialOverview, type: TransactionType) => 
            facet.totals.find((t) => t._id === type)?.total || 0;

        const currentCommission = getSum(current, TransactionType.PLATFORM_COMMISSION);
        const currentAds = getSum(current, TransactionType.AD_REVENUE);
        const currentSubscriptions = getSum(current, TransactionType.SUBSCRIPTION_PURCHASE);
        const currentTrainerPayouts = Math.abs(getSum(current, TransactionType.SESSION_PAYOUT));

        const prevCommission = getSum(previous, TransactionType.PLATFORM_COMMISSION);
        const prevAds = getSum(previous, TransactionType.AD_REVENUE);
        const prevTrainerPayouts = Math.abs(getSum(previous, TransactionType.SESSION_PAYOUT));

        const totalProfit = (currentCommission + currentAds + currentSubscriptions) - currentTrainerPayouts;
        const prevProfit = (prevCommission + prevAds) - prevTrainerPayouts; // Simplified for demo

        // Subscription Split
        const premiumRev = current.subscriptionSplit.find((s) => s._id.isPremium)?.total || 0;
        const basicRev = current.subscriptionSplit.find((s) => !s._id.isPremium)?.total || 0;

        return {
            summary: {
                totalProfit,
                adRevenue: currentAds,
                commissionEarnings: currentCommission,
                trainerEarnings: currentTrainerPayouts,
                growth: {
                    profit: FinanceAnalyticsService.calculateGrowth(totalProfit, prevProfit),
                    revenue: FinanceAnalyticsService.calculateGrowth(currentAds + currentCommission, prevAds + prevCommission),
                    commission: FinanceAnalyticsService.calculateGrowth(currentCommission, prevCommission),
                    trainerEarnings: FinanceAnalyticsService.calculateGrowth(currentTrainerPayouts, prevTrainerPayouts)
                }
            },
            subscriptionSplit: {
                premium: premiumRev,
                basic: basicRev,
                total: currentSubscriptions
            },
            chartData: current.chartData.map((d) => ({
                date: d._id.date,
                type: d._id.type,
                amount: d.amount
            }))
        };
    }
}
