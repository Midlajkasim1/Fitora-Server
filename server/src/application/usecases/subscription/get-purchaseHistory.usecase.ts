import { GetPurchaseHistoryRequestDTO } from "@/application/dto/subscription/request/get-purchaseHistory.dto";
import { GetPurchaseHistoryResponseDTO } from "@/application/dto/subscription/response/get-purchaseHistory.dto";
import { PurchaseHistoryItemDTO } from "@/application/dto/subscription/response/purchase-historyItem.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IPaymentRepository } from "@/domain/interfaces/repositories/payment.repository";


export class GetPurchaseHistoryUseCase implements IBaseUseCase<GetPurchaseHistoryRequestDTO,GetPurchaseHistoryResponseDTO>{
    constructor(
        private readonly _paymentRepository:IPaymentRepository
    ){}
    async execute(dto: GetPurchaseHistoryRequestDTO): Promise<GetPurchaseHistoryResponseDTO> {
        const {history,total} = await this._paymentRepository.findHistoryByUserId(
            dto.userId,
            dto.page,
            dto.limit
        );
        const historyitems = history.map(item=> new PurchaseHistoryItemDTO({
            paymentId:item.paymentId,
            planName:item.planName,
            amount:item.amount,
            status:item.status,
            subscriptionStatus:item.subscriptionStatus,
            date:item.date,
            paymentMethod:item.paymentMethod

        }));
        return new GetPurchaseHistoryResponseDTO({
            history:historyitems,
            total:total
        });
    }
}