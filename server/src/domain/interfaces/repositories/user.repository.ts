import { AuthProvider, UserRole, UserStatus } from "@/domain/constants/auth.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IBaseRepository } from "./base.repository";

export interface UserWithPassword {
  user: UserEntity;
  passwordHash: string;
}

export interface IUserRepository extends IBaseRepository<UserEntity> {
  create(
    user: UserEntity,
    hashedPassword: string,
    options?: {
      authProvider?: AuthProvider;
      googleId?: string | null;
    }
  ): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserWithPassword | null>;
  findEntityByEmail(email: string): Promise<UserEntity | null>;

  updatePassword(id: string, passwordHash: string): Promise<void>;

  completeOnboarding(userId: string, data: {
    dob: Date;
    gender: string;
    isOnboardingRequired: boolean
  }): Promise<void>;

  updateStatus(id: string, status: UserStatus): Promise<void>;

  findAll(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    specialization?: string;
    role?: UserRole;
  }): Promise<{ users: UserEntity[]; total: number }>;
countAllUsers():Promise<number>;
}