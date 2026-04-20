export enum VideoSessionStatus {
    ACTIVE = "active",
    INTERRUPTED = "interrupted",
    COMPLETED = "completed"
}

export class VideoSession {
    constructor(
        public readonly id: string,
        public readonly slotId: string,
        public status: VideoSessionStatus,
        public readonly startedAt: Date,
        public endedAt?: Date
    ) {}

    complete(): void {
        this.status = VideoSessionStatus.COMPLETED;
        this.endedAt = new Date();
    }

    interrupt(): void {
        this.status = VideoSessionStatus.INTERRUPTED;
    }

    resume(): void {
        this.status = VideoSessionStatus.ACTIVE;
    }
}
