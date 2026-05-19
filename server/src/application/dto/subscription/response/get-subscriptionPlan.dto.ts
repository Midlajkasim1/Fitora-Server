import { SubscriptionPlanManagementListDTO } from "./subscription.managementplan.dto";


export class GetSubscriptionPlanResponseDTO {
  subscriptions!: SubscriptionPlanManagementListDTO[];
  totals!: number;

  constructor(data: GetSubscriptionPlanResponseDTO) {
    Object.assign(this, data);
  }
}