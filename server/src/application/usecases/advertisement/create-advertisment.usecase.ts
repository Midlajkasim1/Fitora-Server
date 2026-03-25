import { CreateAdvertismentRequest } from "@/application/dto/advertisement/request/create-advertisement.dto";
import { CreateAdvertismentResponse } from "@/application/dto/advertisement/response/create-advertisement.dto";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";
import { ADVERTISEMENT_MESSAGES } from "@/domain/constants/messages.constants";
import { AdvertisementEntity } from "@/domain/entities/advertisement/advertisement.entity";
import { IAdvertisementRepository } from "@/domain/interfaces/repositories/advertisement.repository";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";


export class CreateAdvertisementUseCase implements IBaseUseCase<CreateAdvertismentRequest,CreateAdvertismentResponse,UploadFileDTO[]>{
    constructor(
        private readonly _advertisementRepository:IAdvertisementRepository,
        private readonly _storageProvider:IStorageProvider
    ){}
    async execute(dto: CreateAdvertismentRequest, files: UploadFileDTO[]): Promise<CreateAdvertismentResponse> {
        if(!files){
            throw new Error(ADVERTISEMENT_MESSAGES.ADS_BANNER_IMAGE_IS_REQUIRED);
        };
         const bannerImageUrl = await Promise.all(
            files.map((file)=>
         this._storageProvider.uploadImage(
            file.buffer,
            file.originalname,
            file.mimetype
        ))
        );
      
      
   const adEntity = AdvertisementEntity.create({
      brandName:dto.brandName,
      startDate:new Date(dto.startDate),
      expiryDate:new Date(dto.expiryDate),
      brandLink:dto.brandLink,
      bannerImages:bannerImageUrl,
      description:dto.description,
      status:AdvertisementStatus.ACTIVE   
   });
   await this._advertisementRepository.create(adEntity);
   return new CreateAdvertismentResponse({
    message:ADVERTISEMENT_MESSAGES.ADS_CREATED
   });


    }
}