"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMapper = void 0;
const admin_entity_1 = require("@/domain/entities/admin.entity");
class AdminMapper {
    static toEntity(doc) {
        return admin_entity_1.AdminEntity.create({
            id: doc._id.toString(),
            email: doc.email,
            status: doc.status,
        });
    }
}
exports.AdminMapper = AdminMapper;
