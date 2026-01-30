import { Response } from "express";
import { env } from "../config/env.config"; 

export class CookieManager {
  private static readonly ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; 
  private static readonly REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; 

  static setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    this.setAccessCookie(res, accessToken);
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh-token", 
      maxAge: this.REFRESH_TOKEN_MAX_AGE
    });
  }

  static setAccessCookie(res: Response, accessToken: string): void {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: this.ACCESS_TOKEN_MAX_AGE
    });
  }

  static clearAuthCookies(res: Response): void {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh-token" });
  }
}