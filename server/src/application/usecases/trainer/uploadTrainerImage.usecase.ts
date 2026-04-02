import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { UploadTrainerImageRequest } from "@/application/dto/trainer/request/upload-trainerProfile.dto";
import { UploadTrainerImageResponse } from "@/application/dto/trainer/response/upload-trainerProfileimage.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES, TRAINER_MESSAGES } from "@/domain/constants/messages.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";

export class UploadTrainerImageUseCase implements IBaseUseCase<UploadTrainerImageRequest,UploadTrainerImageResponse,UploadFileDTO>{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _storageProvider:IStorageProvider
    ){}
    async execute(dto: UploadTrainerImageRequest, file: UploadFileDTO | undefined): Promise<UploadTrainerImageResponse> {
        const trainer = await this._userRepository.findById(dto.userId);
        if(!trainer){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        if (!file || !file.buffer) {
            throw new Error(AUTH_MESSAGES.FILE_NOT_FOUND);
        }

         const imageUrl = await this._storageProvider.uploadImage(file.buffer,file.originalname,file.mimetype);
     const updateTrainer = UserEntity.create({
              id: trainer.id,
              email: trainer.email,
              firstName: trainer.firstName,
              lastName: trainer.lastName,
              phone: trainer.phone,
              role: trainer.role,
              status: trainer.status,
              isEmailVerified: trainer.isEmailVerified,
              isOnboardingRequired: trainer.isOnboardingRequired,
              approvalStatus: trainer.approvalStatus,
              profileImage: imageUrl,
              dob: trainer.dob,
              gender: trainer.gender,
              createdAt: trainer.createdAt
     });
     await this._userRepository.updateUserProfile(updateTrainer);
     return new UploadTrainerImageResponse({
        profileImage:imageUrl,
        message:TRAINER_MESSAGES.PROFILE_UPLOADED
     });
    }
}