import { Request, Response } from "express";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";

export class AuthController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.registerUseCase.execute(req.body);

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }
}
