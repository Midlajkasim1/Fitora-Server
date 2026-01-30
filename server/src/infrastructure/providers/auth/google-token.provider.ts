import { env } from "@/infrastructure/config/env.config";

import { OAuth2Client } from "google-auth-library";
import { IGoogleTokenProvider } from "@/domain/interfaces/google-token.interface";
import { logger } from "../loggers/logger";

export class GoogleTokenProvider implements IGoogleTokenProvider {
  private client = new OAuth2Client();

  async verifyIdToken(idToken: string) {
    const clientId = env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      logger.error("CRITICAL: GOOGLE_CLIENT_ID is missing in backend .env");
      throw new Error("Server configuration error");
    }

    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: clientId, 
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid Google token");
    }

    return {
      email: payload.email,
      firstName: payload.given_name ?? "",
      lastName: payload.family_name ?? "",
      googleId: payload.sub,
    };
  }
}