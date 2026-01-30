import { ForgotPasswordUseCase } from "@/application/usecases/auth/forgot-password.usecase";
import { GoogleAuthUseCase } from "@/application/usecases/auth/google-auth.usecase";
import { LoginUseCase } from "@/application/usecases/auth/login.usecase";
import { RefreshTokenUseCase } from "@/application/usecases/auth/refresh-token.usecase";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { ResendOtpUseCase } from "@/application/usecases/auth/resend-otp.usecase";
import { ResetPasswordUseCase } from "@/application/usecases/auth/reset-password.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { VerifyResetOtpUseCase } from "@/application/usecases/auth/verify-reset-otp.usecase";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { CookieManager } from "@/infrastructure/security/cookie-manager";
import { forgotPasswordSchema } from "@/infrastructure/validators/user/forgot-password.validator";
import { googleLoginSchema } from "@/infrastructure/validators/user/google-login.validator";
import { loginSchema } from "@/infrastructure/validators/user/login.validator";
import { registerSchema } from "@/infrastructure/validators/user/register.validator";
import { resendOtpSchema } from "@/infrastructure/validators/user/resend-otp.validator";
import { resetPasswordSchema } from "@/infrastructure/validators/user/reset-password.validator";
import { verifyOtpSchema } from "@/infrastructure/validators/user/verify-otp.validator";
import { verifyResetOtpSchema } from "@/infrastructure/validators/user/verify-reset-otp.validator";
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
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
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
        message: message
      });
    }
  }
  async verifyOtp(req: Request, res: Response): Promise<Response> {
    try {
      const dto = verifyOtpSchema.parse(req.body);
      const result = await this.verifyOtpUseCase.execute(dto);
      CookieManager.setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: {
          user: result.user 
        }
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.cookies.refreshToken;
      if (!token) throw new Error("Refresh token missing");

      const result = await this.refreshTokenUseCase.execute({ refreshToken: token });

      CookieManager.setAccessCookie(res, result.accessToken);
      return res.status(HttpStatus.OK).json({
        success: true,
        accessToken: result.accessToken
      });
    } catch (error: any) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message || "Session expired"
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
          role: result.role,
          isOnboardingRequired: result.isOnboardingRequired

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
