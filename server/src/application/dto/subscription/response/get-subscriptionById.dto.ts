import { PlanSessionType, SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";



export class GetSubscriptionPlanByIdResponseDTO {
  id!: string;
  name!: string;
  price!: number;
  billingCycle!: string;
  description!: string;
  status?: SubscriptionPlanStatus;
  sessionType!: PlanSessionType;
  sessionCredits!: number;
  hasAiWorkout!: boolean;
  hasAiDiet!: boolean;
  createdAt!: Date;

  constructor(data: GetSubscriptionPlanByIdResponseDTO) {
    Object.assign(this, data);
  }
}