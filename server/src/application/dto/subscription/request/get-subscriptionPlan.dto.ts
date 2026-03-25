import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";


export class GetSubscriptionPlanRequestDTO {
  page!: number;
  limit!: number;
  search?: string;
  status?: SubscriptionPlanStatus;

  constructor(data: GetSubscriptionPlanRequestDTO) {
    Object.assign(this, data);
  }
}