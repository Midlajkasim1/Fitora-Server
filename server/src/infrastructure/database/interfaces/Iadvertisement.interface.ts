import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";
import { Types } from "mongoose";


export interface IAdvertisementDocument {
       _id:Types.ObjectId;
        brandName:string;
        startDate:Date;
        expiryDate:Date;
        brandLink:string;
        bannerImages:string[];
        description?:string | null ;
        status:AdvertisementStatus;
        createdAt:Date;
        updatedAt:Date;     

}