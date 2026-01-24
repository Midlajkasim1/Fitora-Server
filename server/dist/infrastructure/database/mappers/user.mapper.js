"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_entity_1 = require("@/domain/entities/user.entity");
class UserMapper {
    static toEntity(doc) {
        return user_entity_1.UserEntity.create({
            id: doc._id.toString(),
            email: doc.email,
            firstName: doc.firstName,
            lastName: doc.lastName,
            phone: doc.phone,
            role: doc.role,
            status: doc.status,
            isEmailVerified: doc.isEmailVerified,
        });
    }
    static toMongo(user, passwordHash, options) {
        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            status: user.status,
            isEmailVerified: options?.isEmailVerified ?? true,
            authProvider: options?.authProvider ?? "local",
            googleId: options?.googleId ?? null,
            password: passwordHash,
        };
    }
}
exports.UserMapper = UserMapper;
