"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controllers_1 = require("@/infrastructure/di/user/user.controllers");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/register", (req, res) => user_controllers_1.userControllers.authController.register(req, res));
router.post("/verify-otp", (req, res) => user_controllers_1.userControllers.authController.verifyOtp(req, res));
router.post("/resend-otp", (req, res) => {
    user_controllers_1.userControllers.authController.resendOtp(req, res);
});
router.post("/login", (req, res) => {
    user_controllers_1.userControllers.authController.login(req, res);
});
router.post("/google", (req, res) => user_controllers_1.userControllers.authController.googleLogin(req, res));
exports.default = router;
