import { UserEntity } from "@/domain/entities/user.entity";
import { IBaseRepository } from "./base.repository";
import { AuthProvider } from "@/domain/constants/auth.constants";

export interface UserWithPassword {
  user: UserEntity;
  passwordHash: string;
}

export interface IUserRepository  extends IBaseRepository<UserEntity>{
  create(
    user: UserEntity,
    hashedPassword: string,
    options?: {
      authProvider?:AuthProvider;
      googleId?: string | null;
    }
  ): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserWithPassword | null>;
  findEntityByEmail(email: string): Promise<UserEntity | null>;
  
  updatePassword(id: string, passwordHash: string): Promise<void>;

}