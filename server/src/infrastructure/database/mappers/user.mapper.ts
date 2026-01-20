import { UserEntity, UserRole, UserStatus } from "@/domain/entities/user.entity";

export class UserMapper {

  static fromMongo(doc: any): UserEntity {
    return UserEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone,
      role: doc.role as UserRole,
      status: doc.status as UserStatus,
      isEmailVerified: doc.isEmailVerified
    });
  }

  static toMongo(
    user: UserEntity,
    hashedPassword: string,
    extra?: {
      authProvider?: "local" | "google";
      googleId?: string | null;
      isEmailVerified?: boolean;
    }
  ) {
    return {
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isEmailVerfied:user.isEmailVerified,
      authProvider: extra?.authProvider ?? "local",
      googleId: extra?.googleId ?? null,
    };
  }
}
