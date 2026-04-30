import { Socket } from "socket.io";
import { parse as parseCookies } from "cookie";
import jwt from "jsonwebtoken";
import { env } from "@/infrastructure/config/env.config";
import { JwtPayload } from "@/domain/interfaces/services/token.interface";
import { logger } from "@/infrastructure/providers/loggers/logger";

/**
 * Socket.io middleware that authenticates the incoming connection.
 * Token is read from:
 *   1. Cookie header: accessToken=<jwt>
 *   2. Handshake auth: { token: "Bearer <jwt>" }
 */
export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
): void => {
  try {
    let token: string | undefined;

    // --- Strategy 1: Cookie ---
    const rawCookie = socket.handshake.headers.cookie;
    if (rawCookie) {
      const cookies = parseCookies(rawCookie);
      token = cookies["accessToken"];
    }

    // --- Strategy 2: Auth header (Bearer token) ---
    if (!token && socket.handshake.auth?.token) {
      const raw = socket.handshake.auth.token as string;
      token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;
    }

    if (!token) {
      logger.warn(`[Socket Auth] No token — connection rejected (${socket.id})`);
      return next(new Error("Unauthorized: No token provided"));
    }

    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    socket.data.user = payload;
    logger.info(`[Socket Auth] Authenticated: userId=${payload.userId}`);
    next();
  } catch {
    logger.warn(`[Socket Auth] Invalid token — connection rejected (${socket.id})`);
    next(new Error("Unauthorized: Invalid or expired token"));
  }
};
