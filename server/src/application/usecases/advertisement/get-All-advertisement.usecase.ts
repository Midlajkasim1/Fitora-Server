import { GetAllAdvertismentRequest } from "@/application/dto/advertisement/request/get-allAdvertisement.dto";
import { AdvertisementManagmentDTO } from "@/application/dto/advertisement/response/advertisment-management.dto";
import { GetAllAdvertismentResponse } from "@/application/dto/advertisement/response/get-allAdvertisment.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ADVERTISEMENT_MESSAGES } from "@/domain/constants/messages.constants";
import { IAdvertisementRepository } from "@/domain/interfaces/repositories/advertisement.repository";


export class GetAllAdvertisementUseCase implements IBaseUseCase<GetAllAdvertismentRequest,GetAllAdvertismentResponse>{
    constructor(
        private readonly _advertisementRepository:IAdvertisementRepository
    ){}
    async execute(dto: GetAllAdvertismentRequest): Promise<GetAllAdvertismentResponse> {
        const {data,total} = await this._advertisementRepository.findAllAd(dto);
        const advertisementList:AdvertisementManagmentDTO[]=data.map((ad)=>{
            if(!ad.id){
                throw new Error(ADVERTISEMENT_MESSAGES.ADS_ID_MISSING);
            }
            return new AdvertisementManagmentDTO({
                id:ad.id!,
                brandName:ad.brandName,
                expiryDate:ad.expiryDate,
                status:ad.status
            });
        });
        return new GetAllAdvertismentResponse({
            Advertisement:advertisementList,
            total:total
        });
    }
}