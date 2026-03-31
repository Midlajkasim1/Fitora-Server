import { GetTrainerVerificationRequestDTO } from "@/application/dto/admin/request/get-trainerVerfication.dto";
import { GetTrainerVerificationResponseDTO } from "@/application/dto/admin/response/get-trainerVerfication.dto";
import { TrainerVerificationListDTO } from "@/application/dto/admin/response/trainer-verficationManagement.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";


export class GetTrainerVerificationUseCase implements IBaseUseCase<GetTrainerVerificationRequestDTO,GetTrainerVerificationResponseDTO>{
    constructor(
        private readonly _trainerRepository:ITrainerRepository,
        private readonly _userRepository:IUserRepository
    ){}
  async  execute(dto: GetTrainerVerificationRequestDTO): Promise<GetTrainerVerificationResponseDTO> {
        const {data,total} = await this._trainerRepository.findAllTrainerVerification(dto);
    const result: TrainerVerificationListDTO[] = [];

    for (const trainer of data) {
      const user = await this._userRepository.findById(trainer.userId);
      if (!user) continue;

      result.push(new TrainerVerificationListDTO({
        id: trainer.id!,
        userId: trainer.userId,
        trainerName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        experienceYear: trainer.experienceYear,
        approvalStatus: trainer.approvalStatus,
        createdAt: user.createdAt!,
      }));
    }

     return new GetTrainerVerificationResponseDTO({
        trainers:result,
        total
     });
    }
}