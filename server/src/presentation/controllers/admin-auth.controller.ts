import { Request, Response } from "express";
import { AdminLoginUseCase } from "@/application/usecases/admin/admin-login.usecase";

export class AdminAuthController {
  constructor(
    private readonly adminLoginUseCase: AdminLoginUseCase
  ) {}

  async login(req: Request, res: Response) {
    try {
      const result = await this.adminLoginUseCase.execute(req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
