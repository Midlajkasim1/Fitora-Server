export class PayoutCalculator {
    private static readonly TRAINER_SHARE_PERCENT = 0.8;
    private static readonly PLATFORM_SHARE_PERCENT = 0.2;

    /**
     * Calculates the split for a session payout.
     * @param sessionValue The total value of the session (usually planPrice / sessionCredits)
     * @returns { trainerAmount: number, platformFee: number }
     */
    static calculateSplit(sessionValue: number): { trainerAmount: number; platformFee: number } {
        const trainerAmount = sessionValue * this.TRAINER_SHARE_PERCENT;
        const platformFee = sessionValue * this.PLATFORM_SHARE_PERCENT;
        
        return {
            trainerAmount: Number(trainerAmount.toFixed(2)),
            platformFee: Number(platformFee.toFixed(2))
        };
    }
}
