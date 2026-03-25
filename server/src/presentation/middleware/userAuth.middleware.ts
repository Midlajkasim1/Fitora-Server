import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { JwtPayload } from "@/domain/interfaces/services/token.interface";
import { env } from "@/infrastructure/config/env.config";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";


export const authenticateUser = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED
      });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;


      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      };

      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      next();
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED
      });
    }
  };
};