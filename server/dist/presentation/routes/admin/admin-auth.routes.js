"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controllers_1 = require("@/infrastructure/di/admin/admin.controllers");
const router = (0, express_1.Router)();
router.post("/login", (req, res) => admin_controllers_1.adminControllers.adminAuthController.login(req, res));
exports.default = router;
