"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = void 0;
const admin_controllers_1 = require("./admin/admin.controllers");
const user_controllers_1 = require("./user/user.controllers");
exports.controllers = {
    ...admin_controllers_1.adminControllers,
    ...user_controllers_1.userControllers,
};
