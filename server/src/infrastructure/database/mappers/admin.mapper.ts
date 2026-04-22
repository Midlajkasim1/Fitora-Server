import { AdminEntity } from "@/domain/entities/admin/admin.entity";
import { IAdminDocument } from "../interfaces/admin-document.interface";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";

export class AdminMapper implements IMapper<AdminEntity, IAdminDocument> {
  toEntity(doc: IAdminDocument): AdminEntity {
    return AdminEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      status: doc.status,
      role: doc.role
    });
  }

  toMongo(entity: AdminEntity): Partial<IAdminDocument> {
    return {
      email: entity.email,
      status: entity.status,
      role: entity.role
    };
  }
}