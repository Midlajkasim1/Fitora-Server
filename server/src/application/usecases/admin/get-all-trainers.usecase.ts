import { GetTrainersRequestDTO } from "@/application/dto/admin/request/get-trainer.dto";
import { TrainerManagementDTO } from "@/application/dto/admin/response/trainer-management.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { GetTrainersResponseDTO } from "../../dto/admin/response/get-trainers.dto";
import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { UserEntity } from "@/domain/entities/user/user.entity";

export class GetAllTrainersUseCase implements IBaseUseCase<GetTrainersRequestDTO, GetTrainersResponseDTO> {
  constructor(
    private readonly trainerRepository: ITrainerRepository

  ) {}

  async execute(dto: GetTrainersRequestDTO): Promise<GetTrainersResponseDTO> {
    const { trainers, total } = await this.trainerRepository.findAllTrainers(dto);
 

    const trainerList: TrainerManagementDTO[] = trainers.map((trainer:UserEntity) => {
      if (!trainer.id) throw new Error(AUTH_MESSAGES.ENTITY_ID_MISSING);

      return {
        id: trainer.id,
        email: trainer.email,
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        profileImage: trainer.profileImage,
        status: trainer.status,
        createdAt: trainer.createdAt || new Date(),
      };
    });

    return {
      trainers: trainerList,
      total
    };
  }
}