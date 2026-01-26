import { VerifyResetOtpResponseDTO } from "@/application/dto/auth/response/verify-reset-otp.dto";
import { ForgotPasswordUseCase } from "@/application/usecases/auth/forgot-password.usecase";
import { GoogleAuthUseCase } from "@/application/usecases/auth/google-auth.usecase";
import { LoginUseCase } from "@/application/usecases/auth/login.usecase";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { ResendOtpUseCase } from "@/application/usecases/auth/resend-otp.usecase";
import { ResetPasswordUseCase } from "@/application/usecases/auth/reset-password.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { VerifyResetOtpUseCase } from "@/application/usecases/auth/verify-reset-otp.usecase";
import { forgotPasswordSchema } from "@/application/validators/user/forgot-password.validator";
import { googleLoginSchema } from "@/application/validators/user/google-login.validator";
import { loginSchema } from "@/application/validators/user/login.validator";
import { registerSchema } from "@/application/validators/user/register.validator";
import { resendOtpSchema } from "@/application/validators/user/resend-otp.validator";
import { resetPasswordSchema } from "@/application/validators/user/reset-password.validator";
import { verifyOtpSchema } from "@/application/validators/user/verify-otp.validator";
import { verifyResetOtpSchema } from "@/application/validators/user/verify-reset-otp.validator";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { CookieManager } from "@/infrastructure/security/cookie-manager";
import { Request, Response } from "express";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleAuthUseCase: GoogleAuthUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyResetOtpUseCase: VerifyResetOtpUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) { }


  async register(req: Request, res: Response): Promise<Response> {
    try {
      const dto = registerSchema.parse(req.body);
      await this.registerUseCase.execute(dto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error: any) {
      const message = error.errors 
      ? error.errors[0].message 
      : (error.message || "Registration failed");
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:message
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    try {
      const dto = verifyOtpSchema.parse(req.body);
      await this.verifyOtpUseCase.execute(dto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Account verfied successfully",
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  }
  async resendOtp(req: Request, res: Response): Promise<Response> {
    try {

      const dto = resendOtpSchema.parse(req.body);

      await this.resendOtpUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP resent successfully",
      });
    } catch (error: any) {
      return res.status(HttpStatus.OK).json({
        success: false,
        message: error.message,
      });
    }
  }


  async login(req: Request, res: Response): Promise<Response> {
    try {
      const dto = loginSchema.parse(req.body);

      const result = await this.loginUseCase.execute(dto);
      CookieManager.setAuthCookies(res, result.accessToken, result.refreshToken);
       return res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          role: result.role
        }
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }


 async googleLogin(req: Request, res: Response): Promise<Response> {
  try {
    const dto = googleLoginSchema.parse(req.body); 

    const result = await this.googleAuthUseCase.execute(dto);

    CookieManager.setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        role: result.role,
        isOnboardingRequired: result.isOnboardingRequired
      },
    });
  } catch (error: any) {
    return res.status(HttpStatus.BAD_REQUEST).json({ 
      success: false, 
      message: error.message || "Google Authentication failed" 
    });
  }
}
  // next forgot passoword
  async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const dto = forgotPasswordSchema.parse(req.body);

      const result = await this.forgotPasswordUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({ 
        success: true, 
        message: result.message 
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async verifyResetOtp(req: Request, res: Response): Promise<Response> {
    try {
      const dto = verifyResetOtpSchema.parse(req.body);
      const result = await this.verifyResetOtpUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({ 
        success: true, 
        data: result 
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const dto = resetPasswordSchema.parse(req.body);
      const result = await this.resetPasswordUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({ 
        success: true, 
        message: result.message 
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }


}
