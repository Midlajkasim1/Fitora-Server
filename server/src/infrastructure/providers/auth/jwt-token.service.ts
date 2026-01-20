import jwt from "jsonwebtoken";
import { ITokenService } from "@/domain/interfaces/token.interface";
export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }
}
