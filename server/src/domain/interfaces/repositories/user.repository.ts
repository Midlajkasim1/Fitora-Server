import { UserEntity } from "@/domain/entities/user.entity";

export interface UserWithPassword {
  user: UserEntity;
  passwordHash: string;
}

export interface IUserRepository {
  create(
    user: UserEntity,
    hashedPassword: string,
    options?: {
      authProvider?: "local" | "google";
      googleId?: string | null;
    }
  ): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserWithPassword | null>;
  findById(id: string): Promise<UserEntity | null>;
  findEntityByEmail(email: string): Promise<UserEntity | null>;

}