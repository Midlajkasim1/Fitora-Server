import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/infrastructure/config/env.config"; 
import { JwtPayload } from "@/domain/interfaces/token.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: AUTH_MESSAGES.UNAUTHORIZED});
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    
    req.user = decoded; 

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, message: AUTH_MESSAGES.INVALID_TOKEN });
  }
};