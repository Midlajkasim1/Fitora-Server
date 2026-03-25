import { CheckUserBlockResponseDTO } from "@/application/dto/auth/response/check-user-block.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserStatus } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";




export class CheckUserBlockUseCase implements IBaseUseCase<string,CheckUserBlockResponseDTO>{
    constructor(
        private readonly _userRepository:IUserRepository
    ){}
   async execute(userId: string): Promise<CheckUserBlockResponseDTO> {
        const user = await this._userRepository.findById(userId);
        if(!user){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        return new CheckUserBlockResponseDTO({
            userId:user.id!,
            status:user.status,
            isBlocked:user.status === UserStatus.BLOCKED
        });
            
    }
}