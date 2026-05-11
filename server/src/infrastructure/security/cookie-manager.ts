import { Response } from "express";
import { env } from "../config/env.config";

export class CookieManager {
  private static readonly ACCESS_TOKEN_MAX_AGE = env.ACCESS_TOKEN_MAX_AGE;
  private static readonly REFRESH_TOKEN_MAX_AGE = env.REFRESH_TOKEN_MAX_AGE;

  private static get defaultOptions() {
    return {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      path: "/",
    };
  }

  static setAccessCookie(res: Response, accessToken: string): void {
    res.cookie("accessToken", accessToken, {
      ...this.defaultOptions,
      maxAge: this.ACCESS_TOKEN_MAX_AGE,
    });
  }

  static setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    this.setAccessCookie(res, accessToken);

    res.cookie("refreshToken", refreshToken, {
      ...this.defaultOptions,
      maxAge: this.REFRESH_TOKEN_MAX_AGE,
    });
  }

  static clearAuthCookies(res: Response): void {
    res.clearCookie("accessToken", this.defaultOptions);
    res.clearCookie("refreshToken", this.defaultOptions);
  }
}