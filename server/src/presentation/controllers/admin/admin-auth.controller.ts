import { AdminLoginDTO } from "@/application/dto/admin/request/admin-login.dto";
import { AdminRefreshRequestDTO } from "@/application/dto/admin/request/AdminRefreshTokenDTO";
import { AdminLoginResponseDTO } from "@/application/dto/admin/response/admin-login.dto";
import { AdminRefreshResponseDTO } from "@/application/dto/admin/response/admin-refresh.dto";
import { GetAdminMeResponseDTO } from "@/application/dto/admin/response/get-admin-me.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { CookieManager } from "@/infrastructure/security/cookie-manager";
import { adminLoginSchema } from "@/infrastructure/validators/admin/admin-login.validators";
import { Request, Response } from "express";

export class AdminAuthController {
  constructor(
    private readonly _adminLoginUseCase: IBaseUseCase<AdminLoginDTO, AdminLoginResponseDTO>,
    private readonly _adminRefreshTokenUseCase: IBaseUseCase<AdminRefreshRequestDTO, AdminRefreshResponseDTO>,
    private readonly _getAdminMeUsecase: IBaseUseCase<string, GetAdminMeResponseDTO>,

  ) { }

  async login(req: Request, res: Response): Promise<Response> {

    const dto = adminLoginSchema.parse(req.body);
    const result = await this._adminLoginUseCase.execute(dto);
    CookieManager.setAuthCookies(res, result.accessToken, result.refreshToken);
    return res.status(HttpStatus.OK).json({ success: true, data: result });

  }

  async refreshToken(req: Request, res: Response): Promise<Response> {

    const token = req.cookies.refreshToken;
    if (!token) throw new Error(AUTH_MESSAGES.REFRESH_TOKEN_MISSING);
    const result = await this._adminRefreshTokenUseCase.execute({
      refreshToken:token
    });

    CookieManager.setAccessCookie(res, result.accessToken);

    return res.status(HttpStatus.OK).json({
      success: true,
      accessToken: result.accessToken
    });

  }


  async getAdminMe(req: Request, res: Response): Promise<Response> {

    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: AUTH_MESSAGES.UNAUTHORIZED });
    }

    const result = await this._getAdminMeUsecase.execute(adminId);

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });

  }

  async logout(req: Request, res: Response): Promise<Response> {
    CookieManager.clearAuthCookies(res);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: AUTH_MESSAGES.ADMIN_LOGIN
    });
  }


}
