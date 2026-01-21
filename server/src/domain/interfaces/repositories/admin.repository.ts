import { AdminEntity } from "@/domain/entities/admin.entity";

export interface AdminWithPassword {
  admin: AdminEntity;
  passwordHash: string;
}

export interface IAdminRepository {
  findByEmail(email: string): Promise<AdminWithPassword | null>;
}
