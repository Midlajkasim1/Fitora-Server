import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { UploadImageRequest } from "@/application/dto/user/request/upload-profileImage.dto";
import { UploadImageResponse } from "@/application/dto/user/response/upload-profileImage.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";


export class UploadProfileImageUseCase implements IBaseUseCase<UploadImageRequest,UploadImageResponse,UploadFileDTO>{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _storageProvider:IStorageProvider
    ){}
    async execute(dto: UploadImageRequest, file:UploadFileDTO): Promise<UploadImageResponse> {
         const  user = await this._userRepository.findById(dto.userId);
         if(!user){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
         }
         const imageUrl = await this._storageProvider.uploadImage(file.buffer,file.originalname,file.mimetype);
         
         const updateUser = UserEntity.create({
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              role: user.role,
              status: user.status,
              isEmailVerified: user.isEmailVerified,
              isOnboardingRequired: user.isOnboardingRequired,
              approvalStatus: user.approvalStatus,
              profileImage: imageUrl,
              dob: user.dob,
              gender: user.gender,
              createdAt: user.createdAt
         });
     await this._userRepository.updateUserProfile(updateUser);
    return {
        profileImage:imageUrl,
        message:AUTH_MESSAGES.PROFILE_IMAGE_UPDATED
    };
    }
}