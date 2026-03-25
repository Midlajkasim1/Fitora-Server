export class PurchaseSubscriptionRequestDTO {
  userId!: string;
  userEmail!: string;
  userName!: string;
  planId!: string;

  constructor(data: PurchaseSubscriptionRequestDTO) {
    Object.assign(this, data);
  }
}