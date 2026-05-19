import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";

export class GetAdvertisementByIdResponse{
  id!:string;
  brandName!: string;
  startDate!: Date | string;
  expiryDate!:Date | string;
  brandLink!: string;
  bannerImages?: string[];
  description?:string;
  status?:AdvertisementStatus;
  createdAt!:Date;
  updatedAt!:Date;
  constructor(data:GetAdvertisementByIdResponse){
    Object.assign(this,data);
  }
}