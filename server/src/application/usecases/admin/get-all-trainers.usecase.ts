import { GetTrainersRequestDTO } from "@/application/dto/admin/request/get-trainer.dto";
import { TrainerManagementDTO } from "@/application/dto/admin/response/trainer-management.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserRole } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { GetUsersRequestDTO } from "../../dto/admin/request/get-users.dto";
import { GetTrainersResponseDTO } from "../../dto/admin/response/get-trainers.dto";

export class GetAllTrainersUseCase implements IBaseUseCase<GetUsersRequestDTO, GetTrainersResponseDTO> {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(dto: GetTrainersRequestDTO): Promise<GetTrainersResponseDTO> {
    const { users, total } = await this._userRepository.findAll({
      ...dto,
      role: UserRole.TRAINER 
    });


    const trainerList: TrainerManagementDTO[] = users.map((user) => {
      if (!user.id) throw new Error(AUTH_MESSAGES.ENTITY_ID_MISSING);

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        status: user.status,
        createdAt: user.createdAt || new Date(),
      };
    });

    return {
      trainers: trainerList,
      total
    };
  }
}