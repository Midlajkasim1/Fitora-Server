import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";



export class AllUserCount {
constructor(
  private readonly _userRepository:IUserRepository
){}
    async execute():Promise<number>{
     return  await this._userRepository.countAllUsers();
    }
}