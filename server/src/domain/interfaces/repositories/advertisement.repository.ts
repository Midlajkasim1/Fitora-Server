import { AdvertisementEntity } from "@/domain/entities/advertisement/advertisement.entity";
import { IBaseRepository } from "./base.repository";
import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";

export interface IAdvertisementRepository  extends IBaseRepository<AdvertisementEntity>{
    findActiveAds():Promise<AdvertisementEntity[]>;
    findAllAd(params:{
    page:number;
    limit:number;
    search?:string;
    status?:AdvertisementStatus; 
    }):Promise<{data:AdvertisementEntity[];total:number}>,
    updateStatus(id:string,status:AdvertisementStatus):Promise<void>;
}