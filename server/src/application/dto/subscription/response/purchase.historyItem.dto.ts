
export class PurchaseHistoryItemDTO {
  paymentId!: string;
  planName!: string;
  amount!: number;
  status!: string;
  subscriptionStatus!:string;
  date!: Date;
  paymentMethod!: string;

  constructor(data: PurchaseHistoryItemDTO) {
    Object.assign(this, data);
  }
}