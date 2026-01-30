import { AuthProvider } from "@/domain/constants/auth.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IMapper } from "@/domain/interfaces/mapper.interface";
import { IUserDocument } from "../interfaces/user-document.interface";

export class UserMapper implements IMapper<UserEntity, IUserDocument> {
   toEntity(doc: IUserDocument): UserEntity {
    return UserEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone,
      role: doc.role,
      status: doc.status,
      isEmailVerified: doc.isEmailVerified,
      dob: doc.dob,
      gender: doc.gender,
      isOnboardingRequired: doc.isOnboardingRequired,
    });
  }

   toMongo(
    user: UserEntity,
    passwordHash?: string,
    options?: {
      authProvider?: AuthProvider;
      googleId?: string | null;
      isEmailVerified?: boolean;
    }
  ):Partial<IUserDocument> {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      dob: user.dob,
      gender: user.gender,
      isOnboardingRequired: user.isOnboardingRequired,
      isEmailVerified: options?.isEmailVerified ?? true,
      authProvider: options?.authProvider ?? AuthProvider.LOCAL,
      googleId: options?.googleId ?? null,
      password: passwordHash,
    };
  }
}
