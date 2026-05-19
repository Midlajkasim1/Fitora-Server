import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";


export class AdvertisementManagmentDTO{
    id!:string;
    brandName!:string;
    expiryDate!:Date | string;
    status!:AdvertisementStatus;
    constructor(data:AdvertisementManagmentDTO){
        Object.assign(this,data);
    }

}