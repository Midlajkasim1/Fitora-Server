import { AdminLoginUseCase } from "@/application/usecases/admin/admin-login.usecase";
import { AdminRefreshUseCase } from "@/application/usecases/admin/admin-refresh.usecase";
import { GetAdminMeUseCase } from "@/application/usecases/admin/get-admin-me.usecase";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { CookieManager } from "@/infrastructure/security/cookie-manager";
import { adminLoginSchema } from "@/infrastructure/validators/admin/admin-login.validators";
import { Request, Response } from "express";

export class AdminAuthController {
  constructor(
    private readonly _adminLoginUseCase: AdminLoginUseCase,
    private readonly _adminRefreshTokenUseCase: AdminRefreshUseCase,
    private readonly _getAdminMeUsecase: GetAdminMeUseCase

  ) {}

  async login(req: Request, res: Response) {
    try {
      const dto = adminLoginSchema.parse(req.body);
      const result = await this._adminLoginUseCase.execute(dto);
      CookieManager.setAccessCookie(res, result.accessToken);
      return res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

async refreshToken(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error(AUTH_MESSAGES.REFRESH_TOKEN_MISSING);

    const result = await this._adminRefreshTokenUseCase.execute(token);

    CookieManager.setAccessCookie(res, result.accessToken);

    return res.status(200).json({
      success: true,
      accessToken: result.accessToken 
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || AUTH_MESSAGES.SESSION_EXPIRED,
    });
  }
}


async getAdminMe(req: Request, res: Response): Promise<Response> {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ success: false, message: AUTH_MESSAGES.UNAUTHORIZED });
    }

    const result = await this._getAdminMeUsecase.execute(adminId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || AUTH_MESSAGES.ADMIN_SESSION_EXPIRED,
    });
  }
}

async logout(req: Request, res: Response): Promise<Response> {
  CookieManager.clearAuthCookies(res);
  return res.status(200).json({ 
    success: true, 
    message: AUTH_MESSAGES.ADMIN_LOGIN
  });
}

}
