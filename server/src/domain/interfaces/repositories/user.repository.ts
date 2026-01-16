import { UserEntity } from "@/domain/entities/user.entity";

export interface IUserRepository {
  create(
    user: UserEntity,
    hashedPassword: string,
    options?: {
      authProvider?: "local" | "google";
      googleId?: string | null;
    }
  ): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}
