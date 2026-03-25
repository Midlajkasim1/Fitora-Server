import { UpdateStatusAdvertisementRequestDTO } from "@/application/dto/advertisement/request/updateStatus-advertisement.dto";
import { UpdateStatusAdvertisementResponseDTO } from "@/application/dto/advertisement/response/updateStatus-advertisment.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ADVERTISEMENT_MESSAGES } from "@/domain/constants/messages.constants";
import { IAdvertisementRepository } from "@/domain/interfaces/repositories/advertisement.repository";

export class UpdateStatusAdvertisementUseCase implements IBaseUseCase<UpdateStatusAdvertisementRequestDTO,UpdateStatusAdvertisementResponseDTO>{
    constructor(
        private readonly _advertisementRepository:IAdvertisementRepository
    ){}
  async execute(dto: UpdateStatusAdvertisementRequestDTO): Promise<UpdateStatusAdvertisementResponseDTO> {
        const advertisement = await this._advertisementRepository.findById(dto.adId);
        if(!advertisement){
            throw new Error(ADVERTISEMENT_MESSAGES.ADS_NOT_FOUND);
        }
        advertisement.isToggleStatus();
        const newStatus = advertisement.status;
        await this._advertisementRepository.updateStatus(dto.adId,newStatus);
        return new UpdateStatusAdvertisementResponseDTO({
            adId:advertisement.id!,
            brandName:advertisement.brandName,
            status:newStatus,
            message:ADVERTISEMENT_MESSAGES.ADVERTISEMENT_STATUS_UPDATED(newStatus)
        });

    }
}