import { IAdminRepository, AdminWithPassword } from "@/domain/interfaces/repositories/admin.repository";
import { AdminModel } from "../models/admin.models";
import { AdminMapper } from "../mappers/admin.mapper";
import { AdminEntity } from "@/domain/entities/admin/admin.entity";
import { IAdminDocument } from "../interfaces/admin-document.interface";

export class AdminRepository implements IAdminRepository {
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