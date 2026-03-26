import { AdminEntity } from "@/domain/entities/admin/admin.entity";
import { AdminWithPassword, IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";
import { IAdminDocument } from "../interfaces/admin-document.interface";
import { AdminMapper } from "../mappers/admin.mapper";
import { AdminModel } from "../models/admin.models";

export class AdminRepository  implements IAdminRepository {
  async findByEmail(email: string): Promise<AdminWithPassword | null> {
    const doc = await AdminModel.findOne({ email }).lean() as IAdminDocument | null;
    
    if (!doc) return null;

    return {
      admin: AdminMapper.toEntity(doc),
      passwordHash: doc.password,
    };
  }

  async findById(id: string): Promise<AdminEntity | null> {
    const doc = await AdminModel.findById(id).lean() as IAdminDocument | null;
    
    if (!doc) return null;

    return AdminMapper.toEntity(doc);
  }
}