import { VideoSession } from "@/domain/entities/video/video-session.entity";

export interface IVideoSessionRepository {
    save(session: VideoSession): Promise<void>;
    findBySlotId(slotId: string): Promise<VideoSession | null>;
    updateStatus(slotId: string, status: string): Promise<void>;
}
