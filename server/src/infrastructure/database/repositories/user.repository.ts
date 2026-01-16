import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { UserEntity } from "@/domain/entities/user.entity";
import { UserModel } from "../models/user.models";
import { UserMapper } from "../mappers/user.mapper";


export class UserRepository implements IUserRepository {

  async create(
    user: UserEntity,
    hashedPassword: string,
    options?: {
      authProvider?: "local" | "google";
      googleId?: string | null;
    }
  ): Promise<UserEntity> {

    const persistenceData = UserMapper.toMongo(
      user,
      hashedPassword,
      {
        authProvider: options?.authProvider,
        googleId: options?.googleId,
        isEmailVerified: options?.authProvider === "google",
      }
    );

    const createdDoc = await UserModel.create(persistenceData);

    return UserMapper.fromMongo(createdDoc);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email });

    return doc ? UserMapper.fromMongo(doc) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);

    return doc ? UserMapper.fromMongo(doc) : null;
  }
}
