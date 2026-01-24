"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_models_1 = require("../models/user.models");
const user_mapper_1 = require("../mappers/user.mapper");
class UserRepository {
    async create(user, hashedPassword, options) {
        const data = user_mapper_1.UserMapper.toMongo(user, hashedPassword, {
            authProvider: options?.authProvider,
            googleId: options?.googleId,
            isEmailVerified: true,
        });
        const doc = await user_models_1.UserModel.create(data);
        return user_mapper_1.UserMapper.toEntity(doc);
    }
    async findByEmail(email) {
        const doc = await user_models_1.UserModel.findOne({ email }).select("+password");
        if (!doc || !doc.password)
            return null;
        return {
            user: user_mapper_1.UserMapper.toEntity(doc),
            passwordHash: doc.password,
        };
    }
    async findById(id) {
        const doc = await user_models_1.UserModel.findById(id).lean();
        return doc ? user_mapper_1.UserMapper.toEntity(doc) : null;
    }
    async findEntityByEmail(email) {
        const doc = await user_models_1.UserModel.findOne({ email });
        return doc ? user_mapper_1.UserMapper.toEntity(doc) : null;
    }
}
exports.UserRepository = UserRepository;
