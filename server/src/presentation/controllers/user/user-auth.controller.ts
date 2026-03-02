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
    private readonly _registerUseCase: IBaseUseCase<RegisterDTO, RegisterResponseDTO>,
    private readonly _verifyOtpUseCase: IBaseUseCase<VerifyOtpDTO, VerifyOtpResponseDTO>,
    private readonly resendOtpUseCase: IBaseUseCase<ResendOtpDTO, ResendOtpResponseDTO>,
    private readonly _loginUseCase: IBaseUseCase<LoginDTO, LoginResponseDTO>,
    private readonly _googleAuthUseCase: IBaseUseCase<GoogleDTO, GoogleLoginResponseDTO>,
    private readonly _forgotPasswordUseCase: IBaseUseCase<ForgotPasswordRequestDTO, ForgotPasswordResponseDTO>,
    private readonly _verifyResetOtpUseCase: IBaseUseCase<VerifyResetOtpDTO, VerifyResetOtpResponseDTO>,
    private readonly _resetPasswordUseCase: IBaseUseCase<ResetPasswordDTO, ResetPasswordResponseDTO>,
    private readonly _refreshTokenUseCase: IBaseUseCase<RefreshTokenRequestDTO, RefreshTokenResponseDTO>,
    private readonly _getMeUseCase: IBaseUseCase<string, GetMeResponseDTO>
  ) { }


  async register(req: Request, res: Response): Promise<Response> {
    const dto = registerSchema.parse(req.body);
    await this._registerUseCase.execute(dto);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: AUTH_MESSAGES.OTP_SENT,
    });

  }
  async verifyOtp(req: Request, res: Response): Promise<Response> {

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

  }

  async refreshToken(req: Request, res: Response): Promise<Response> {

    const token = req.cookies.refreshToken;
    if (!token) throw new Error(AUTH_MESSAGES.REFRESH_TOKEN_MISSING);
    const result = await this._refreshTokenUseCase.execute({ refreshToken: token });
    CookieManager.setAccessCookie(res, result.accessToken);
    return res.status(HttpStatus.OK).json({
      success: true,
      accessToken: result.accessToken
    });

  }
  async resendOtp(req: Request, res: Response): Promise<Response> {

    const dto = resendOtpSchema.parse(req.body);

    await this.resendOtpUseCase.execute(dto);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: AUTH_MESSAGES.OTP_RESENT,
    });

  }


  async login(req: Request, res: Response): Promise<Response> {

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

  }


  async googleLogin(req: Request, res: Response): Promise<Response> {

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

  }
  async forgotPassword(req: Request, res: Response): Promise<Response> {

    const dto = forgotPasswordSchema.parse(req.body);

    const result = await this._forgotPasswordUseCase.execute(dto);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: result.message
    });

  }

  async verifyResetOtp(req: Request, res: Response): Promise<Response> {

    const dto = verifyResetOtpSchema.parse(req.body);
    const result = await this._verifyResetOtpUseCase.execute(dto);

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result
    });

  }

  async resetPassword(req: Request, res: Response): Promise<Response> {

    const dto = resetPasswordSchema.parse(req.body);
    const result = await this._resetPasswordUseCase.execute(dto);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: result.message
    });

  }

  async getMe(req: Request, res: Response): Promise<Response> {

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: AUTH_MESSAGES.UNAUTHORIZED });
    }

    const result = await this._getMeUseCase.execute(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });

  }
  async logout(req: Request, res: Response): Promise<Response> {
    CookieManager.clearAuthCookies(res);
    return res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.USERLOGOUT
    });
  }

}
