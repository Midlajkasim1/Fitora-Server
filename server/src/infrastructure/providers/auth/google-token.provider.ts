import { OAuth2Client } from "google-auth-library";
import { IGoogleTokenProvider } from "@/domain/interfaces/google-token.interface";

export class GoogleTokenProvider implements IGoogleTokenProvider {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyIdToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
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
