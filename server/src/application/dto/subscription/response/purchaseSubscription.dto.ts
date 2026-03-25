export class PurchaseSubscriptionResponseDTO {
  checkoutUrl!: string;

  constructor(data: PurchaseSubscriptionResponseDTO) {
    Object.assign(this, data);
  }
}