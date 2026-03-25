import { UpdateTrainerApprovalRequestDTO } from "@/application/dto/admin/request/update-trainerApproval.dto";
import { UpdateTrainerApprovalResponseDTO } from "@/application/dto/admin/response/update-trainerApproval.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ApprovalStatus } from "@/domain/constants/auth.constants";
import { ADMIN_MESSAGES, AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IEmailService } from "@/domain/interfaces/services/email-service.interface";



export class UpdateApprovalStatusUseCase implements IBaseUseCase<UpdateTrainerApprovalRequestDTO,UpdateTrainerApprovalResponseDTO>{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _trainerDetailsRepository:ITrainerRepository,
        private readonly _emailService:IEmailService
    ){}
    async execute(dto: UpdateTrainerApprovalRequestDTO): Promise<UpdateTrainerApprovalResponseDTO> {
        const trainer = await this._trainerDetailsRepository.findById(dto.trainerDetailId);
        if(!trainer){
            throw new Error(ADMIN_MESSAGES.TRAINER_NOT_FOUND);
        }
        const user = await this._userRepository.findById(trainer.userId);
        if(!user){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        if(dto.status === ApprovalStatus.REJECTED && !dto.reason){
            throw new Error(ADMIN_MESSAGES.TRAINER_REJECTION_REASON);
        }
        await this._trainerDetailsRepository.updateApprovalStatus(
            dto.trainerDetailId,
            dto.status,
            dto.reason
        );
        if(dto.status === ApprovalStatus.APPROVED){
            await this._emailService.sendTrainerApprovalEmail(
                user.email,
                `${user.firstName} ${user.lastName}`
            );
        }else{
            await this._emailService.sendTrainerRejectEmail(
                user.email,
                `${user.firstName} ${user.lastName}`,
                dto.reason!
            );
        }
        return new UpdateTrainerApprovalResponseDTO({
            message:ADMIN_MESSAGES.TRAINER_APPROVAL_DONE
        });
    }
}