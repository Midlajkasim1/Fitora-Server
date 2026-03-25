import {  UserRole, UserStatus } from "@/domain/constants/auth.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IBaseRepository } from "./base.repository";

export interface UserWithPassword {
  user: UserEntity;
  passwordHash: string;
}

export interface IUserRepository extends IBaseRepository<UserEntity> {
 createWithGoogle(user: UserEntity, googleId: string): Promise<UserEntity>;
createWithPassword(user: UserEntity, passwordHash: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
  findEntityByEmail(email: string): Promise<UserEntity | null>;
findAllUsers(params: {
    page: number;
    limit: number;
    search?: string;
    status?: UserStatus | string;
    role?: UserRole; 
  }): Promise<{ data: UserEntity[]; total: number }>;
  updatePassword(id: string, passwordHash: string): Promise<void>;

  completeOnboarding(userId: string, data: {
    dob: Date;
    gender: string;
    isOnboardingRequired: boolean
  }): Promise<void>;

  updateStatus(id: string, status: UserStatus): Promise<void>;


    updateUserProfile(user:UserEntity):Promise<UserEntity | null>;
findPasswordById(userId:string):Promise<string | null>;

}