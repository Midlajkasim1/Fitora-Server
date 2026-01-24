"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositories = void 0;
const user_repository_1 = require("@/infrastructure/database/repositories/user.repository");
exports.userRepositories = {
    userRepository: new user_repository_1.UserRepository(),
};
