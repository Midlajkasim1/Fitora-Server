import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { UpdateSpecializationDTO } from "@/application/dto/specialization/request/update-specialization.dto";
import { UpdateSpecializationResponseDTO } from "@/application/dto/specialization/response/update-specialization.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SPECIALIZATION_MESSAGES } from "@/domain/constants/messages.constants";
import { SpecializationEntity } from "@/domain/entities/specialization/specialization.entity";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";



export class UpdateSpecializationUsecase implements IBaseUseCase<UpdateSpecializationDTO,UpdateSpecializationResponseDTO,UploadFileDTO>{
    constructor(
        private readonly _specializationRepository:ISpecialization,
        private readonly  _storageProvider:IStorageProvider,        
    ){}
    async execute(dto: UpdateSpecializationDTO, file: UploadFileDTO): Promise<UpdateSpecializationResponseDTO> {
       const existing = await this._specializationRepository.findById(dto.id);

       if(!existing){
        throw new Error(SPECIALIZATION_MESSAGES.SPECIALIZATION_NOT_FOUND);
       }
       if(dto.name && dto.name!==existing.name){
        const duplicate = await this._specializationRepository.findByName(dto.name);
        if(duplicate){
            throw new Error(SPECIALIZATION_MESSAGES.NAME_ALREADY_EXIST);
        }
       }
       let imageUrl = existing.imageUrl;
       if(file){
        imageUrl= await this._storageProvider.uploadImage(file.buffer,file.originalname,file.mimetype);
       }

       const updatedSpecialization = SpecializationEntity.create({
        id:existing.id ,
        name: dto.name ||   existing.name,
        description: dto.description ??  existing.description,
        imageUrl:imageUrl,
        status:existing.status,
        createdAt:existing.createdAt,
        updatedAt:new Date()

       });
       await this._specializationRepository.update(updatedSpecialization);

       return {
        message:SPECIALIZATION_MESSAGES.SPECIALIZATION_UPDATED
       };
    }
}