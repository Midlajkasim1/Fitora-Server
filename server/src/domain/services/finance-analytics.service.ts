export class FinanceAnalyticsService {
    /**
     * Calculates the period-over-period growth percentage.
     * Formula: ((Current - Previous) / Previous) * 100
     */
    static calculateGrowth(current: number, previous: number): number {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        const growth = ((current - previous) / previous) * 100;
        return Number(growth.toFixed(1));
    }

    /**
     * Aggregates daily data for charts.
     */
    static formatChartData(data: { date: string, commission: number, ads: number }[]) {
        return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
}
