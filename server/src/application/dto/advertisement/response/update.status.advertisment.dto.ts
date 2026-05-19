import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";

export class UpdateStatusAdvertisementResponseDTO{
    adId!:string;
    brandName!:string;
    status!:AdvertisementStatus;
    message!:string;
    constructor(data:UpdateStatusAdvertisementResponseDTO){
        Object.assign(this,data);
    }
}