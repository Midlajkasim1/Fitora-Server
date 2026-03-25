import { GetAdvertisementByIdRequest } from "@/application/dto/advertisement/request/get-AdvertisementByid.dto";
import { GetAdvertisementByIdResponse } from "@/application/dto/advertisement/response/get-advertisementById.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ADVERTISEMENT_MESSAGES } from "@/domain/constants/messages.constants";
import { IAdvertisementRepository } from "@/domain/interfaces/repositories/advertisement.repository";



export class GetAdvertisementById implements IBaseUseCase<GetAdvertisementByIdRequest,GetAdvertisementByIdResponse>{
    constructor(
        private readonly _advertisementRepository:IAdvertisementRepository
    ){}
  async  execute(dto: GetAdvertisementByIdRequest): Promise<GetAdvertisementByIdResponse> {
      const advertisementById = await this._advertisementRepository.findById(dto.adId);
      if(!advertisementById){
        throw new Error(ADVERTISEMENT_MESSAGES.ADS_NOT_FOUND);
      }
      return new GetAdvertisementByIdResponse({
        id:advertisementById.id!,
        brandName:advertisementById.brandName,
        startDate:advertisementById.startDate,
        expiryDate:advertisementById.expiryDate,
        brandLink:advertisementById.brandLink,
        bannerImages:advertisementById.bannerImages,
        description:advertisementById.description,
        status:advertisementById.status,
        createdAt:advertisementById.createdAt!,
        updatedAt:advertisementById.updatedAt!

      });

    }
}