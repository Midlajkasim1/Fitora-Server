import { ForgotPasswordRequestDTO } from "@/application/dto/auth/request/forgot-password.dto";
import { GoogleDTO } from "@/application/dto/auth/request/google.dto";
import { LoginDTO } from "@/application/dto/auth/request/login.dto";
import { RefreshTokenRequestDTO } from "@/application/dto/auth/request/refresh-token.dto";
import { RegisterDTO } from "@/application/dto/auth/request/register.dto";
import { ResendOtpDTO } from "@/application/dto/auth/request/resend-otp.dto";
import { ResetPasswordDTO } from "@/application/dto/auth/request/reset-password.dto";
import { VerifyOtpDTO } from "@/application/dto/auth/request/verify-otp.dto";
import { VerifyResetOtpDTO } from "@/application/dto/auth/request/verify-reset-otp.dto";
import { ForgotPasswordResponseDTO } from "@/application/dto/auth/response/forgot-password.dto";
import { GetMeResponseDTO } from "@/application/dto/auth/response/get-me.dto";
import { GoogleLoginResponseDTO } from "@/application/dto/auth/response/google-login.dto";
import { LoginResponseDTO } from "@/application/dto/auth/response/login.dto";
import { RefreshTokenResponseDTO } from "@/application/dto/auth/response/refresh-token.dto";
import { RegisterResponseDTO } from "@/application/dto/auth/response/register.dto";
import { ResendOtpResponseDTO } from "@/application/dto/auth/response/resend-otp.dto";
import { ResetPasswordResponseDTO } from "@/application/dto/auth/response/reset-password.dto";
import { VerifyOtpResponseDTO } from "@/application/dto/auth/response/verify-otp.dto";
import { VerifyResetOtpResponseDTO } from "@/application/dto/auth/response/verify-reset-otp.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
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
    private readonly _registerUseCase: IBaseUseCase<RegisterDTO,RegisterResponseDTO>,
    private readonly _verifyOtpUseCase: IBaseUseCase<VerifyOtpDTO,VerifyOtpResponseDTO>,
    private readonly resendOtpUseCase: IBaseUseCase<ResendOtpDTO,ResendOtpResponseDTO>,
    private readonly _loginUseCase: IBaseUseCase<LoginDTO,LoginResponseDTO>,
    private readonly _googleAuthUseCase: IBaseUseCase<GoogleDTO,GoogleLoginResponseDTO>,
    private readonly _forgotPasswordUseCase: IBaseUseCase<ForgotPasswordRequestDTO,ForgotPasswordResponseDTO>,
    private readonly _verifyResetOtpUseCase: IBaseUseCase<VerifyResetOtpDTO,VerifyResetOtpResponseDTO>,
    private readonly _resetPasswordUseCase: IBaseUseCase<ResetPasswordDTO,ResetPasswordResponseDTO>,
    private readonly _refreshTokenUseCase: IBaseUseCase<RefreshTokenRequestDTO,RefreshTokenResponseDTO>,
    private readonly _getMeUseCase: IBaseUseCase<string,GetMeResponseDTO>
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
          iOnboardingRequired: result.isOnboardingRequired,
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
