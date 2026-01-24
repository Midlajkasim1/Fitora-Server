"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const user_auth_controller_1 = require("@/presentation/controllers/user-auth.controller");
const user_usecases_1 = require("./user.usecases");
exports.userControllers = {
    authController: new user_auth_controller_1.AuthController(user_usecases_1.useCases.registerUseCase, user_usecases_1.useCases.verifyOtpUseCase, user_usecases_1.useCases.resendOtpUseCase, user_usecases_1.useCases.loginUseCase, user_usecases_1.useCases.googleAuthUseCase),
};
