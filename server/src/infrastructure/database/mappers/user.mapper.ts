import { UserEntity } from "@/domain/entities/user.entity";

export class UserMapper {
  static toEntity(doc: any): UserEntity {
    return UserEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone,
      role: doc.role,
      status: doc.status,
      isEmailVerified: doc.isEmailVerified,
    });
  }

  static toMongo(
    user: UserEntity,
    passwordHash: string,
    options?: {
      authProvider?: "local" | "google";
      googleId?: string | null;
      isEmailVerified?: boolean;
    }
  ) {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isEmailVerified: options?.isEmailVerified ?? true,
      authProvider: options?.authProvider ?? "local",
      googleId: options?.googleId ?? null,
      password: passwordHash,
    };
  }
}
