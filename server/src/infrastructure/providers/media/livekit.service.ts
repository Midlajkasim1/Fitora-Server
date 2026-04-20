import { IMediaServerProvider } from "@/domain/interfaces/services/media-server.interface";
import { env } from "@/infrastructure/config/env.config";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { AccessToken } from "livekit-server-sdk";

/**
 * LiveKitMediaServer — Concrete implementation of IMediaServerProvider
 * for SFU sessions using the official LiveKit SDK.
 */
export class LiveKitMediaServer implements IMediaServerProvider {
    private readonly apiKey: string;
    private readonly apiSecret: string;

    constructor() {
        this.apiKey = env.LIVEKIT_API_KEY || "devkey";
        this.apiSecret = env.LIVEKIT_API_SECRET || "secret";
    }

    /**
     * Generates a real, cryptographically signed token using LiveKit SDK.
     */
    async generateToken(roomId: string, participantId: string, participantName: string, isTrainer: boolean): Promise<string> {
        logger.info(`[LiveKit] Creating Real Token for Room: ${roomId}, User: ${participantId}`);

        try {
            const at = new AccessToken(this.apiKey, this.apiSecret, {
                identity: participantId,
                name: participantName,
                metadata: JSON.stringify({ role: isTrainer ? 'trainer' : 'client' })
            });

            at.addGrant({
                roomJoin: true,
                room: roomId,
                canPublish: true,
                canSubscribe: true,
                canPublishData: true,
                // Trainers get host privileges (optional, can be used for server-side control)
            });

            return await at.toJwt();
        } catch (error) {
            logger.error("[LiveKit] Token generation failed:", error);
            throw new Error("Could not generate video session token");
        }
    }

    async closeSession(roomId: string): Promise<void> {
        logger.info(`[LiveKit] Closing room: ${roomId}`);
        // In a production environment, you could use the RoomService 
        // to forcefully delete the room on the LiveKit server.
    }
}
