export enum VideoSessionStatus {
    ACTIVE = "active",
    INTERRUPTED = "interrupted",
    COMPLETED = "completed"
}

export interface IVideoSessionProps {
    id?: string;
    slotId: string;
    status: VideoSessionStatus;
    startedAt: Date;
    endedAt?: Date;
}

export class VideoSessionEntity {
    private readonly _id?: string;
    private readonly _slotId: string;
    private _status: VideoSessionStatus;
    private readonly _startedAt: Date;
    private _endedAt?: Date;

    constructor(props: IVideoSessionProps) {
        this._id = props.id;
        this._slotId = props.slotId;
        this._status = props.status;
        this._startedAt = props.startedAt;
        this._endedAt = props.endedAt;
    }

    static create(props: {
        id?: string;
        slotId: string;
        status?: VideoSessionStatus;
        startedAt?: Date;
        endedAt?: Date;
    }) {
        return new VideoSessionEntity({
            id: props.id,
            slotId: props.slotId,
            status: props.status ?? VideoSessionStatus.ACTIVE,
            startedAt: props.startedAt ?? new Date(),
            endedAt: props.endedAt
        });
    }

    get id() { return this._id; }
    get slotId() { return this._slotId; }
    get status() { return this._status; }
    get startedAt() { return this._startedAt; }
    get endedAt() { return this._endedAt; }

    public complete(): void {
        this._status = VideoSessionStatus.COMPLETED;
        this._endedAt = new Date();
    }

    public interrupt(): void {
        this._status = VideoSessionStatus.INTERRUPTED;
    }

    public resume(): void {
        this._status = VideoSessionStatus.ACTIVE;
    }
}
