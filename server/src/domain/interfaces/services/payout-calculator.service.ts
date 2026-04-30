export class PayoutCalculator {
    private static readonly TRAINER_SHARE_PERCENT = 0.8;
    private static readonly PLATFORM_SHARE_PERCENT = 0.2;

    static calculateSplit(params: { sessionValueInPaise: number }): { trainerAmountPaise: number; platformFeePaise: number } {
        const { sessionValueInPaise } = params;
        const trainerAmountPaise = Math.floor(sessionValueInPaise * this.TRAINER_SHARE_PERCENT);
        const platformFeePaise = sessionValueInPaise - trainerAmountPaise;
        
        return {
            trainerAmountPaise,
            platformFeePaise
        };
    }

 
    static toRupees(params: { paise: number }): number {
        return params.paise / 100;
    }
}
