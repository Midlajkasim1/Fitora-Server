import { ForgotPasswordUseCase } from "@/application/usecases/auth/forgot-password.usecase";
import { GetMeUseCase } from "@/application/usecases/auth/get-me.usecase";
import { GoogleAuthUseCase } from "@/application/usecases/auth/google-auth.usecase";
import { LoginUseCase } from "@/application/usecases/auth/login.usecase";
import { RefreshTokenUseCase } from "@/application/usecases/auth/refresh-token.usecase";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { ResendOtpUseCase } from "@/application/usecases/auth/resend-otp.usecase";
import { ResetPasswordUseCase } from "@/application/usecases/auth/reset-password.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { VerifyResetOtpUseCase } from "@/application/usecases/auth/verify-reset-otp.usecase";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
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
    private readonly _registerUseCase: RegisterUseCase,
    private readonly _verifyOtpUseCase: VerifyOtpUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly _loginUseCase: LoginUseCase,
    private readonly _googleAuthUseCase: GoogleAuthUseCase,
    private readonly _forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly _verifyResetOtpUseCase: VerifyResetOtpUseCase,
    private readonly _resetPasswordUseCase: ResetPasswordUseCase,
    private readonly _refreshTokenUseCase: RefreshTokenUseCase,
    private readonly _getMeUseCase: GetMeUseCase
  ) { }


  async register(req: Request, res: Response): Promise<Response> {
    try {
      const dto = registerSchema.parse(req.body);
      await this._registerUseCase.execute(dto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: AUTH_MESSAGES.OTP_SENT,
      });
    } catch (error: any) {
     let message = AUTH_MESSAGES.REGISTER_FAIL;
    
    if (error.name === "ZodError") {
      message = error.errors[0].message;
    } else if (error.message) {
      message = error.message;
    }

    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: message
      });
    }
  }
  async verifyOtp(req: Request, res: Response): Promise<Response> {
    try {
      const dto = verifyOtpSchema.parse(req.body);
      const result = await this._verifyOtpUseCase.execute(dto);
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
      if (!token) throw new Error(AUTH_MESSAGES.REFRESH_TOKEN_MISSING);

      const result = await this._refreshTokenUseCase.execute({ refreshToken: token });

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
        message: AUTH_MESSAGES.OTP_RESENT,
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

      const result = await this._loginUseCase.execute(dto);
      CookieManager.setAuthCookies(res, result.accessToken, result.refreshToken);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.LOGINSUCCESS,
        data: {
       user: {
          id: result.userId, 
          email: dto.email,
          role: result.role,
          isOnboardingRequired: result.isOnboardingRequired,
          approval_status: result.approval_status

        }

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

      const result = await this._googleAuthUseCase.execute(dto);

      CookieManager.setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: {
         user: {
          ...result.user,
          approval_status: result.user.approval_status 
        }
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

      const result = await this._forgotPasswordUseCase.execute(dto);

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
      const result = await this._verifyResetOtpUseCase.execute(dto);

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
      const result = await this._resetPasswordUseCase.execute(dto);

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

  async getMe(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.user?.userId; 
    
    if (!userId) {
      return res.status(401).json({ success: false, message: AUTH_MESSAGES.UNAUTHORIZED });
    }

    const result = await this._getMeUseCase.execute(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Session expired",
    });
  }
}
async logout(req: Request, res: Response): Promise<Response> {
  CookieManager.clearAuthCookies(res);
  return res.status(200).json({ 
    success: true, 
    message: AUTH_MESSAGES.USERLOGOUT
  });
}

}
