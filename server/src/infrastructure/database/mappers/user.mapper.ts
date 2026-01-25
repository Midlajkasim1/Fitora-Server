import { UserEntity } from "@/domain/entities/user.entity";
import { IUserDocument } from "../interfaces/user-document.interface";
import { AuthProvider } from "@/domain/constants/auth.constants";
import { IMapper } from "@/domain/interfaces/mapper.interface";

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
      isEmailVerified: options?.isEmailVerified ?? true,
      authProvider: options?.authProvider ?? AuthProvider.LOCAL,
      googleId: options?.googleId ?? null,
      password: passwordHash,
    };
  }
}
