import { GoogleAuthUseCase } from "@/application/usecases/auth/google-auth.usecase";
import { LoginUseCase } from "@/application/usecases/auth/login.usecase";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { ResendOtpUseCase } from "@/application/usecases/auth/resend-otp.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { googleLoginSchema } from "@/application/validators/google-login.validator";
import { loginSchema } from "@/application/validators/login.validator";
import { registerSchema } from "@/application/validators/register.validator";
import { resendOtpSchema } from "@/application/validators/resend-otp.validator";
import { verifyOtpSchema } from "@/application/validators/verify-otp.validator";
import { Request, Response } from "express";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleAuthUseCase: GoogleAuthUseCase,
  ) { }


  async register(req: Request, res: Response): Promise<Response> {
    try {
      const dto = registerSchema.parse(req.body)
      await this.registerUseCase.execute(dto);

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
      const dto = verifyOtpSchema.parse(req.body);
      await this.verifyOtpUseCase.execute(dto)
      return res.status(200).json({
        success: true,
        message: "Account verfied successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  }
  async resendOtp(req: Request, res: Response): Promise<Response> {
    try {

      const dto = resendOtpSchema.parse(req.body);

      await this.resendOtpUseCase.execute(dto);

      return res.status(200).json({
        success: true,
        message: "OTP resent successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }


  async login(req: Request, res: Response): Promise<Response> {
    try {
      const dto = loginSchema.parse(req.body)

      const result= await this.loginUseCase.execute(dto)
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          role: result.role
        }
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }


  async googleLogin(req: Request, res: Response): Promise<Response> {
    try {
       const dto = googleLoginSchema.parse(req.body)
       const result = await this.googleAuthUseCase.execute(dto);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,   
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 
      });

      return res.status(200).json({
        success: true,
        data: {
          role: result.role,
          isOnboardingRequired: result.isOnboardingRequired //
        },
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // next forgot passoword

}
