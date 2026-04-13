import { GetTrainerVerificationByIdRequestDTO } from "@/application/dto/admin/request/get-TrainerverificationById.dto";
import { GetTrainerVerificationByIdResponseDTO } from "@/application/dto/admin/response/get-trainerVerificationById.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ADMIN_MESSAGES, AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";




export class GetTrainerVerificationByIdUseCase implements IBaseUseCase<GetTrainerVerificationByIdRequestDTO, GetTrainerVerificationByIdResponseDTO> {
    constructor(
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _specializationRepository: ISpecialization
    ) { }
    async execute(dto: GetTrainerVerificationByIdRequestDTO): Promise<GetTrainerVerificationByIdResponseDTO> {
        const trainer = await this._trainerRepository.findById(dto.id);
        if (!trainer) {
            throw new Error(ADMIN_MESSAGES.TRAINER_NOT_FOUND);
        }
        const user = await this._userRepository.findById(trainer.userId);
        if (!user) {
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const sp = await this._specializationRepository.findById(trainer.specializations);
        return new GetTrainerVerificationByIdResponseDTO({
            id: trainer.id!,
            userId: trainer.userId,
            trainerName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            experienceYear: trainer.experienceYear,
            approvalStatus: trainer.approvalStatus,
            createdAt: user.createdAt!,
            bio: trainer.bio,
            certifications: trainer.certifications,
            specializations: sp ? [{
                id: sp.id!,
                name: sp.name
            }] : [],
            rejectionReason: trainer.rejectionReason ?? null
        });
    }
}