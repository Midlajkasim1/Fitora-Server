import { UpdateAdvertismentRequest } from "@/application/dto/advertisement/request/update-advertisement.dto";
import { UpdateAdvertismentResponse } from "@/application/dto/advertisement/response/update-advetisement.dto";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ADVERTISEMENT_MESSAGES } from "@/domain/constants/messages.constants";
import { IAdvertisementRepository } from "@/domain/interfaces/repositories/advertisement.repository";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";


export class UpdateAdvertisementUseCase implements IBaseUseCase<UpdateAdvertismentRequest,UpdateAdvertismentResponse,UploadFileDTO[]>{
    constructor(
        private readonly _advertisementRepository:IAdvertisementRepository,
        private readonly _storageProvider:IStorageProvider
    ){}
    async execute(dto: UpdateAdvertismentRequest, files: UploadFileDTO[] | undefined): Promise<UpdateAdvertismentResponse> {
     const existingAd = await this._advertisementRepository.findById(dto.id);
     if(!existingAd){
        throw new Error(ADVERTISEMENT_MESSAGES.ADS_NOT_FOUND);
     }   
     let updateImages = existingAd.bannerImages;
     if(files && files.length>0){
        updateImages= await Promise.all(
            files.map(file=>this._storageProvider.uploadImage(
                file.buffer,
                file.originalname,
                file.mimetype
            ) )
        );
     }
     const updateData: Record<string,unknown>={
        brandName:dto.brandName ?? existingAd.brandName,
        startDate:dto.startDate ? new Date(dto.startDate): existingAd.startDate,
        expiryDate:dto.expiryDate ? new Date(dto.expiryDate) : existingAd.expiryDate,
        brandLink: dto.brandLink ?? existingAd.brandLink,
        bannerImages:updateImages,
        description:dto.description ?? existingAd.description,
        status:existingAd.status
     };
     await this._advertisementRepository.update(dto.id,updateData);
     return new UpdateAdvertismentResponse({
        message:ADVERTISEMENT_MESSAGES.ADS_UPDATED
     });
    }
}