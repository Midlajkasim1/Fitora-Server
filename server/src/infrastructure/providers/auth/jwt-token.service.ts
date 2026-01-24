import { ITokenService } from "@/domain/interfaces/token.interface";
import jwt from "jsonwebtoken";
import { env } from "@/infrastructure/config/env.config";
export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: any): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
  }
}
