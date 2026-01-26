import { Request, Response } from "express";
import { AdminLoginUseCase } from "@/application/usecases/admin/admin-login.usecase";
import { adminLoginSchema } from "@/application/validators/admin/admin-login-response.dto";
import { HttpStatus } from "@/domain/constants/http-status.constants";

export class AdminAuthController {
  constructor(
    private readonly adminLoginUseCase: AdminLoginUseCase
  ) {}

  async login(req: Request, res: Response) {
    try {
      const dto = adminLoginSchema.parse(req.body);
      const result = await this.adminLoginUseCase.execute(dto);
      return res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}
