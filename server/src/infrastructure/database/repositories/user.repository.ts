import { UserEntity } from "@/domain/entities/user/user.entity";
import { IUserRepository, UserWithPassword } from "@/domain/interfaces/repositories/user.repository";
import { IUserDocument } from "../interfaces/user-document.interface";
import { UserMapper } from "../mappers/user.mapper";
import { UserModel } from "../models/user.models";

export class UserRepository implements IUserRepository {
  constructor(private readonly userMapper: UserMapper) {}

  async create(user: UserEntity, hashedPassword: string, options?: Record<string,unknown>): Promise<UserEntity> {
    const data = this.userMapper.toMongo(user, hashedPassword, options);
    const doc = await UserModel.create(data);
    return this.userMapper.toEntity(doc as unknown as IUserDocument);
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const doc = await UserModel.findOne({ email }).select("+password").lean();
    if (!doc || !doc.password) return null;

    return {
      user: this.userMapper.toEntity(doc as unknown as IUserDocument),
      passwordHash: doc.password,
    };
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id).lean();
    return doc ? this.userMapper.toEntity(doc as unknown as IUserDocument) : null;
  }

  async findEntityByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email }).lean();
    return doc ? this.userMapper.toEntity(doc as unknown as IUserDocument) : null;
  }
  async updatePassword(id: string, passwordHash: string): Promise<void> {
  await UserModel.findByIdAndUpdate(id, { password: passwordHash });
}
async completeOnboarding(userId: string, data: { 
    dob: Date; 
    gender: string; 
    isOnboardingRequired: boolean 
  }): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        dob: data.dob,
        gender: data.gender,
        isOnboardingRequired: data.isOnboardingRequired
      }
    }).exec();

  }
}
