import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { CreateSpecializationDTO } from "@/application/dto/specialization/request/create-specialization.dto";
import { CreateSpecializationResponseDTO } from "@/application/dto/specialization/response/create-specialization.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SPECIALIZATION_MESSAGES } from "@/domain/constants/messages.constants";
import { SpecializationEntity } from "@/domain/entities/specialization/specialization.entity";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";



export class CreateSpecializationUseCase implements IBaseUseCase<CreateSpecializationDTO,CreateSpecializationResponseDTO,UploadFileDTO>{
    constructor(
        private readonly _specializationRepository:ISpecialization,
        private readonly  _storageProvider:IStorageProvider,
    ){}
   async execute(dto: CreateSpecializationDTO,file:UploadFileDTO): Promise<CreateSpecializationResponseDTO> {
      const existing = await this._specializationRepository.findByName(dto.name);

      if(existing){
        throw new Error(SPECIALIZATION_MESSAGES.NAME_ALREADY_EXIST);
      }
      let imageUrl: string | undefined;
      if(file){
       imageUrl= await this._storageProvider.uploadFile(file.buffer,file.originalname,file.mimetype);
      }
      const specialization = SpecializationEntity.create({
        name:dto.name,
        description:dto.description,
        imageUrl:imageUrl
      });
      await this._specializationRepository.create(specialization);
      return {
        message:SPECIALIZATION_MESSAGES.SPECIALIZATION_CREATED
        
      };
  }
  

  
}