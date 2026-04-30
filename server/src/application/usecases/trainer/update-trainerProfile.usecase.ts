import { UpdateTrainerProfileRequest } from "@/application/dto/trainer/request/update-trainer-profile.dto";
import { UpdateTrainerProfileResponseDTO } from "@/application/dto/trainer/response/update-trainerProfile.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES, TRAINER_MESSAGES } from "@/domain/constants/messages.constants";
import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";


export class UpdateTrainerProfileUseCase implements IBaseUseCase<UpdateTrainerProfileRequest,UpdateTrainerProfileResponseDTO>{
  constructor(
    private readonly _userRepository:IUserRepository,
    private readonly _trainerRepository:ITrainerRepository
  ){}
  async execute(dto: UpdateTrainerProfileRequest): Promise<UpdateTrainerProfileResponseDTO> {
      const trainer = await this._userRepository.findById(dto.id);
      if(!trainer){
        throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
      }

   const updateTrainer = UserEntity.create({
    id: trainer.id,
    email: trainer.email,         
    role: trainer.role,         
    firstName: dto.firstName ?? trainer.firstName,
    lastName: dto.lastName ?? trainer.lastName,
    phone: dto.phone ?? trainer.phone,
    profileImage: trainer.profileImage,
    status: trainer.status,
    approvalStatus: trainer.approvalStatus,
    dob: trainer.dob,
    gender: trainer.gender,
    isOnboardingRequired: trainer.isOnboardingRequired
  });
  const trainerDetails = await this._trainerRepository.findByTrainerId(dto.id);
  if (trainerDetails) {
    const updatedDetails = new TrainerDetailsEntity({
      id: trainerDetails.id,
      userId: trainerDetails.userId,
      bio: trainerDetails.bio,
      experienceYear: dto.experience_year ?? trainerDetails.experienceYear,
      certifications: trainerDetails.certifications,
      specializations: trainerDetails.specializations,
      approvalStatus: trainerDetails.approvalStatus,
      walletBalance: trainerDetails.walletBalance,
      reviewCount: trainerDetails.reviewCount,
      averageRating: trainerDetails.averageRating
    });
    await this._trainerRepository.save(updatedDetails);
  }
  await this._userRepository.updateUserProfile(updateTrainer);
  return {
    message:TRAINER_MESSAGES.PROFILE_UPDATED
  }; 
}
}