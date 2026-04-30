export interface IFinancialStatsDTO {
    month: string;
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
}

export interface IRegistrationStatsDTO {
    month: string;
    count: number;
}

export interface GetAdminDashboardStatsResponseDTO {
    statsCards: {
        totalRevenue: number;
        totalSubscriptions: number;
        totalUsers: number;
        totalTrainers: number;
        activeSessions: number;
        planStats: { name: string, count: number }[];
    };
    financialStats: IFinancialStatsDTO[];
    registrationStats: IRegistrationStatsDTO[];
}
