import { Request, Response } from "express";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase
  ) {}

  
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.registerUseCase.execute(req.body);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    try {
      const { email, otp } = req.body;

      const result = await this.verifyOtpUseCase.execute(email, otp);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  }
}
