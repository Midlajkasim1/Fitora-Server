import { IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";
import { AdminModel } from "../models/admin.models";
import { AdminMapper } from "../mappers/admin.mapper";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string) {
    const doc = await AdminModel.findOne({ email });
    if (!doc) return null;

    return {
      admin: AdminMapper.toEntity(doc),
      passwordHash: doc.password,
    };
  }
}
