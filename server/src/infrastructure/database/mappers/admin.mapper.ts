import { AdminEntity } from "@/domain/entities/admin/admin.entity";
import { IAdminDocument } from "../interfaces/admin-document.interface";

export class AdminMapper {
  static toEntity(doc: IAdminDocument): AdminEntity {
    return AdminEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      status: doc.status,
      role:doc.role
    });
  }
}