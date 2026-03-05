import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/infrastructure/config/env.config";
import { JwtPayload } from "@/domain/interfaces/services/token.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";

export const authenticateAdmin = (adminRepository: IAdminRepository) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: AUTH_MESSAGES.UNAUTHORIZED,
        });
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

      const admin = await adminRepository.findById(decoded.userId);

      if (!admin || admin.status !== "active") {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: AUTH_MESSAGES.UNAUTHORIZED,
        });
      }

     req.user = {
        userId: admin.id!,
        email: admin.email,
        name: "Admin", 
        role: admin.role
      };
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      next();
    } catch {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }
  };
};