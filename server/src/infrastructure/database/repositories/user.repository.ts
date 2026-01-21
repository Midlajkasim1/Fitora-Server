import {IUserRepository, UserWithPassword } from "@/domain/interfaces/repositories/user.repository";
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

    const data = UserMapper.toMongo(user, hashedPassword, {
      authProvider: options?.authProvider,
      googleId: options?.googleId,
      isEmailVerified: true,
    });

    const doc = await UserModel.create(data);
    return UserMapper.toEntity(doc);
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const doc = await UserModel.findOne({ email }).select("+password")
    if (!doc || !doc.password) return null;

    return {
      user: UserMapper.toEntity(doc),
      passwordHash:doc.password,
    };
  }


  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id).lean();
    return doc ? UserMapper.toEntity(doc) : null;
  }
   async findEntityByEmail(email: string): Promise<UserEntity | null> {
     const doc = await UserModel.findOne({ email });
    return doc ? UserMapper.toEntity(doc) : null;
  }

}
