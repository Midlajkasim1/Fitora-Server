import { CheckUserBlockResponseDTO } from "@/application/dto/auth/response/check-user-block.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { CookieManager } from "@/infrastructure/security/cookie-manager";
import { NextFunction, Request, Response } from "express";


export const BlockGuard = (blockUserUsecase: IBaseUseCase<string, CheckUserBlockResponseDTO>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: AUTH_MESSAGES.AUTHENTICATION_REQUIRED
                });
            }
            const result = await blockUserUsecase.execute(userId);
            if (result.isBlocked) {
                CookieManager.clearAuthCookies(res);
                return res.status(HttpStatus.FORBIDDEN).json({
                    success: false,
                    message: AUTH_MESSAGES.ACCOUNT_BLOCKED,
                    blocked: true
                });
            }
            next();
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next(error);
            }
        }
    };
};