export class FinanceSummary {
    constructor(
        public readonly totalProfit: number,
        public readonly adRevenue: number,
        public readonly commissionEarnings: number,
        public readonly trainerEarnings: number,
        public readonly subscriptionRevenue: {
            premium: number;
            basic: number;
            total: number;
        },
        public readonly growth: {
            profit: number;
            revenue: number;
            commission: number;
            trainers: number;
        }
    ) {}
}
