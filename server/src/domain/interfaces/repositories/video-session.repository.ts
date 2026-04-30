import { VideoSessionEntity } from "@/domain/entities/video/video-session.entity";

export interface IVideoSessionRepository {
    save(session: VideoSessionEntity): Promise<void>;
    findBySlotId(slotId: string): Promise<VideoSessionEntity | null>;
    updateStatus(slotId: string, status: string): Promise<void>;
}
