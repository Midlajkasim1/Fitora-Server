export class ActiveSubscriptionResponseDTO {
  isPremium!: boolean;
  subscription!: {
    id: string;
    planId: string;
    planName: string;
    endDate: Date;
    status: string;
    hasAiWorkout: boolean;
    hasAiDiet: boolean;
  } | null;

  constructor(data: ActiveSubscriptionResponseDTO) {
    Object.assign(this, data);
  }
}