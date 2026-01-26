import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/infrastructure/config/env.config"; 

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      userId: string;
      email: string;
      role: any; 
    };
    
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};