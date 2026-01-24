"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthController = void 0;
class AdminAuthController {
    adminLoginUseCase;
    constructor(adminLoginUseCase) {
        this.adminLoginUseCase = adminLoginUseCase;
    }
    async login(req, res) {
        try {
            const result = await this.adminLoginUseCase.execute(req.body);
            return res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.AdminAuthController = AdminAuthController;
