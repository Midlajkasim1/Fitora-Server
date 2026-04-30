export interface GetFinanceOverviewResponseDTO {
    summary: {
        totalProfit: number;
        commissionEarnings: number;
        trainerEarnings: number;
        growth: {
            profit: number;
            revenue: number;
            commission: number;
            trainerEarnings: number;
        }
    };
    subscriptionSplit: {
        premium: number;
        basic: number;
        total: number;
    };
    chartData: { date: string; type: string; amount: number; }[];
}