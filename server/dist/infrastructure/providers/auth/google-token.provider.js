"use strict";
// src/providers/auth/google-token.provider.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTokenProvider = void 0;
const google_auth_library_1 = require("google-auth-library");
class GoogleTokenProvider {
    client = new google_auth_library_1.OAuth2Client();
    async verifyIdToken(idToken) {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.error("CRITICAL: GOOGLE_CLIENT_ID is missing in backend .env");
            throw new Error("Server configuration error");
        }
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: clientId, // Use the local variable
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
exports.GoogleTokenProvider = GoogleTokenProvider;
