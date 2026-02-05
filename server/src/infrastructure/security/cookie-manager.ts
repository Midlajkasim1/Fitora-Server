import { Response } from "express";
import { env } from "../config/env.config";

export class CookieManager {
  private static readonly ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
  private static readonly REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

  private static get defaultOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };
  }

  static setAccessCookie(res: Response, accessToken: string): void {
    res.cookie("accessToken", accessToken, {
      ...this.defaultOptions,
      maxAge: this.ACCESS_TOKEN_MAX_AGE,
    });
  }

  static setAuthCookies(res: Response, accessToken: string, refreshToken: string, isAdmin = false): void {
    this.setAccessCookie(res, accessToken);

    const refreshPath = isAdmin ? "/api/admin/refresh-token" : "/api/auth/refresh-token";

    res.cookie("refreshToken", refreshToken, {
      ...this.defaultOptions,
      path: refreshPath,
      maxAge: this.REFRESH_TOKEN_MAX_AGE,
    });
  }

  static clearAuthCookies(res: Response): void {
    const options = this.defaultOptions;

    res.clearCookie("accessToken", options);

    res.clearCookie("refreshToken", { 
      ...options, 
      path: "/api/auth/refresh-token" 
    });

    res.clearCookie("refreshToken", { 
      ...options, 
      path: "/api/admin/refresh-token" 
    });
  }
}