import { Request, Response } from "express";
import { AdminLoginUseCase } from "@/application/usecases/admin/admin-login.usecase";
import { adminLoginSchema } from "@/application/validators/admin/admin-login-response.dto";

export class AdminAuthController {
  constructor(
    private readonly adminLoginUseCase: AdminLoginUseCase
  ) {}

  async login(req: Request, res: Response) {
    try {
      const dto = adminLoginSchema.parse(req.body);
      const result = await this.adminLoginUseCase.execute(dto)
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
