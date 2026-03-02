import { UserStatus } from "@/domain/constants/auth.constants";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { JwtPayload } from "@/domain/interfaces/services/token.interface";
import { env } from "@/infrastructure/config/env.config";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";


export const authenticateUser =(userRepository:IUserRepository)=>{
  return async (req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.accessToken;
    if(!token){
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success:false,
        message:AUTH_MESSAGES.UNAUTHORIZED
      });
    }
    try{
      const decoded = jwt.verify(token,env.JWT_ACCESS_SECRET) as JwtPayload;

      const user = await userRepository.findById(decoded.userId);
      if(!user || user.status!==UserStatus.ACTIVE){
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success:false,
          message:AUTH_MESSAGES.ACCOUNT_BLOCKED
        });
      }

      req.user = decoded;

       res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

        next();
    }catch{
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success:false,
        message:AUTH_MESSAGES.UNAUTHORIZED
      });
    }
  
  };
};