import { PurchaseHistoryItemDTO } from "./purchase-historyItem.dto";

export class GetPurchaseHistoryResponseDTO {
  history!: PurchaseHistoryItemDTO[];
  total!: number;

  constructor(data: GetPurchaseHistoryResponseDTO) {
    Object.assign(this, data);
  }
}