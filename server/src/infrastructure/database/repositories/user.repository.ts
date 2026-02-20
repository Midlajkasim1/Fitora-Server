import { UserRole, UserStatus } from "@/domain/constants/auth.constants";
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
    return this.userMapper.toEntity(doc as IUserDocument);
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
  await UserModel.findByIdAndUpdate(id, {$set:{password:passwordHash}});
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
async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    role?: UserRole; 
  }): Promise<{ users: UserEntity[]; total: number }> {
    const { page, limit, search, status, role } = params;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (role) filter.role = role; 
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
    
      ];
    }

    const [docs, total] = await Promise.all([
      UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IUserDocument[]>(),
      UserModel.countDocuments(filter)
    ]);

    return {
      users: docs.map((doc) => this.userMapper.toEntity(doc)),
      total
    };
  }

async updateStatus(id: string, status: UserStatus): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { 
      $set: { status: status } 
    }).exec();
  }
async countAllUsers(): Promise<number> {
  return await UserModel.countDocuments();
  
}


}


