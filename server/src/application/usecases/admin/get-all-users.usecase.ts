import { GetUsersRequestDTO } from "@/application/dto/admin/request/get-users.dto";
import { GetUsersResponseDTO } from "@/application/dto/admin/response/get-users.dto";
import { UserManagementDTO } from "@/application/dto/admin/response/user-management.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserRole } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";

export class GetAllUsersUseCase implements IBaseUseCase<GetUsersRequestDTO, GetUsersResponseDTO> {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(dto: GetUsersRequestDTO): Promise<GetUsersResponseDTO> {

    const { data, total } = await this._userRepository.findAllUsers({
      ...dto,
      role:UserRole.USER
    });

    const userListItems: UserManagementDTO[] = data.map((user: UserEntity) => {
      if (!user.id) throw new Error(AUTH_MESSAGES.ENTITY_ID_MISSING);

      return new UserManagementDTO({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        status: user.status,
        createdAt: user.createdAt|| new Date(), 
      });
    });

    return new GetUsersResponseDTO({
      users: userListItems,
      total
    });
  }
}