export interface ActiveSubscriptionResponseDTO {
    isPremium: boolean;
    subscription: {
        id: string;
        planId: string;
        planName: string;
        endDate: Date;
        status: string;
    } | null;
}