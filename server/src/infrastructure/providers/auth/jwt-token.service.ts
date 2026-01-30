import { ITokenService, JwtPayload } from "@/domain/interfaces/token.interface";
import jwt from "jsonwebtoken";
import { env } from "@/infrastructure/config/env.config";

export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
  }
  
  verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
  }
}