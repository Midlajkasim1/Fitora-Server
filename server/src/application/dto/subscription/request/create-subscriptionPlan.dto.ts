import { PlanSessionType } from "@/domain/constants/subscription.constants";

export class CreateSubscriptionPlanRequestDTO {
  name!: string;
  price!: number | string;
  billingCycle!: string;
  description!: string;
  sessionType!: PlanSessionType;
  sessionCredits!: number;
  hasAiWorkout!: boolean;
  hasAiDiet!: boolean;

  constructor(data: CreateSubscriptionPlanRequestDTO) {
    Object.assign(this, data);
  }
}