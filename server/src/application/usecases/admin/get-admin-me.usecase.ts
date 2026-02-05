import { IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GetAdminMeResponseDTO } from "../../dto/admin/response/get-admin-me.dto";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";

export class GetAdminMeUseCase implements IBaseUseCase<string, GetAdminMeResponseDTO> {
  constructor(private readonly _adminRepository: IAdminRepository) {}

  async execute(adminId: string): Promise<GetAdminMeResponseDTO> {
    const admin = await this._adminRepository.findById(adminId);

    if (!admin) {
      throw new Error(AUTH_MESSAGES.ADMIN_NOT_FOUND);
    }

    return {
      id: admin.id!,
      email: admin.email,
      role: admin.role, 
    };
  }
}