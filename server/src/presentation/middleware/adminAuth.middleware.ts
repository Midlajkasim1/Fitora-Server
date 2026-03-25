import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/infrastructure/config/env.config";
import { JwtPayload } from "@/domain/interfaces/services/token.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { HttpStatus } from "@/domain/constants/http-status.constants";

export const authenticateAdmin = () => {
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

  
      if (decoded.role !== "admin") {
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: AUTH_MESSAGES.ADMIN_ACESS_DENIED,
        });
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      };

      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      next();
    } catch  {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }
  };
};