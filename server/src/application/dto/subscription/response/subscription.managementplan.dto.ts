import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";


export class SubscriptionPlanManagementListDTO {
  id!: string;
  name!: string;
  price!: number;
  billingCycle!: string;
  description?: string;
  status!: SubscriptionPlanStatus;
  createdAt!: Date;
  totalPurchaseUser!: number;

  constructor(data: SubscriptionPlanManagementListDTO) {
    Object.assign(this, data);
  }
}