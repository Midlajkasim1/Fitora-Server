import { AdminRole, UserRole } from "../constants/auth.constants";

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole | AdminRole;
}

export interface ITokenService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: { userId: string }): string;
  verifyRefreshToken(token: string): { userId: string }
}