import { AdminEntity } from "@/domain/entities/admin.entity";

export class AdminMapper {
  static toEntity(doc: any): AdminEntity {
    return AdminEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      status: doc.status,
    });
  }
}
