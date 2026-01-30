import { AdminEntity } from "@/domain/entities/admin/admin.entity";
import { IBaseRepository } from "./base.repository";

export interface AdminWithPassword {
  admin: AdminEntity;
  passwordHash: string;
}

export interface IAdminRepository extends IBaseRepository<AdminEntity> {
  findByEmail(email: string): Promise<AdminWithPassword | null>;
}
