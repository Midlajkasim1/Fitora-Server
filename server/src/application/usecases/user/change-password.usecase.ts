import { ChangePasswordRequest } from "@/application/dto/user/request/change-password.dto";
import { ChangePasswordResponse } from "@/application/dto/user/response/change-password.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IPasswordHasher } from "@/domain/interfaces/services/password.interface";


export class ChangePasswordUseCase implements IBaseUseCase<ChangePasswordRequest,ChangePasswordResponse>{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _passwordService:IPasswordHasher,
        
    ){}
    async execute(dto: ChangePasswordRequest): Promise<ChangePasswordResponse> {

        const passwordHash = await this._userRepository.findPasswordById(dto.userId);

        if(!passwordHash){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const isMatch = await  this._passwordService.compare(dto.currentPassword,passwordHash);
        if(!isMatch){
            throw new Error(AUTH_MESSAGES.PASSWORD_NOT_CORRECT);
        }
        const newPassword = await this._passwordService.hash(dto.newPassword);
        await this._userRepository.updatePassword(dto.userId,newPassword);
        return new ChangePasswordResponse({
            message:AUTH_MESSAGES.PASSWORD_UPDATE
        });
    }
}