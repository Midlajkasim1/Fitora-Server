export class GetPurchaseHistoryRequestDTO {
  userId!: string;
  page!: number;
  limit!: number;

  constructor(data: GetPurchaseHistoryRequestDTO) {
    Object.assign(this, data);
  }
}