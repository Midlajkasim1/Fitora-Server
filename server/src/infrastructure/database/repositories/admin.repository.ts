import { AdminEntity } from "@/domain/entities/admin/admin.entity";
import { AdminWithPassword, IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";
import { IAdminDocument } from "../interfaces/admin-document.interface";
import { AdminMapper } from "../mappers/admin.mapper";
import { AdminModel } from "../models/admin.models";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";

export class AdminRepository extends BaseRepository<AdminEntity, IAdminDocument> implements IAdminRepository {
  constructor(private readonly _adminMapper: AdminMapper) {
    super(AdminModel as unknown as Model<IAdminDocument>, _adminMapper);
  }

  async findByEmail(email: string): Promise<AdminWithPassword | null> {
    const doc = await AdminModel.findOne({ email }).lean<IAdminDocument>() ;
    
    if (!doc || !doc.password) return null;

    return {
      admin: this._adminMapper.toEntity(doc),
      passwordHash: doc.password,
    };
  }

  async findById(id: string): Promise<AdminEntity | null> {
    const doc = await AdminModel.findById(id).lean<IAdminDocument>();
    
    if (!doc) return null;

    return this._adminMapper.toEntity(doc);
  }
}