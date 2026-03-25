import { PlanSessionType } from "@/domain/constants/subscription.constants";

export class UpdateSubscriptionPlanRequestDTO {
  id!: string;
  name?: string;
  price?: number | string;
  billingCycle?: string;
  description?: string;
  sessionType?: PlanSessionType;
  sessionCredits?: number;
  aiWorkoutLimit?: number;
  aiDietLimit?: number;

  constructor(data: UpdateSubscriptionPlanRequestDTO) {
    Object.assign(this, data);
  }
}