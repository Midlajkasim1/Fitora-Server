import { SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { SessionType, SlotStatus } from "@/domain/constants/session.constants";


export class SlotEntity {
    private readonly _id?: string;
    private readonly _trainerId: string;
    private  _startTime: Date;
    private  _endTime: Date;
    private  _type: SessionType;
    private  _capacity: number;
    private _participants: string[];
    private _status: SlotStatus;

    constructor(props: {
        id?: string;
        trainerId: string;
        startTime: Date;
        endTime: Date;
        type: SessionType;
        capacity: number;
        participants: string[];
        status: SlotStatus
    }) {
        this._id = props.id;
        this._trainerId = props.trainerId;
        this._startTime = props.startTime;
        this._endTime = props.endTime;
        this._type = props.type;
        this._capacity = props.capacity;
        this._participants = props.participants;
        this._status = props.status;
    }
    static create(props: {
        id?: string;
        trainerId: string;
        startTime: Date;
        endTime: Date;
        type: SessionType;
        capacity?: number;
        participants?: string[];
        status?: SlotStatus;
    }) {
        const finalCapacity = props.type === SessionType.ONE_ON_ONE ? 1 : (props.capacity ?? 20);
        const finalParticipants = props.participants ?? [];
        const finalStatus = props.status ?? SlotStatus.AVAILABLE; return new SlotEntity({
            id: props.id,
            trainerId: props.trainerId,
            startTime: props.startTime,
            endTime: props.endTime,
            type: props.type,
            capacity: finalCapacity,
            participants: finalParticipants,
            status: finalStatus,
        });
    }
    public update(props: {
        startTime: Date;
        endTime: Date;
        type: SessionType;
        capacity: number;
    }) {
        const finalCapacity = props.type === SessionType.ONE_ON_ONE ? 1 : props.capacity;

        this._startTime = props.startTime;
        this._endTime = props.endTime;
        this._type = props.type;
        this._capacity = finalCapacity;
    }

    get id() { return this._id; }
    get trainerId() { return this._trainerId; }
    get startTime() { return this._startTime; }
    get endTime() { return this._endTime; }
    get type() { return this._type; }
    get capacity() { return this._capacity; }
    get participants() { return this._participants; }
    get status() { return this._status; }

    public canBeBooked(): boolean {
    return (
      this._status === SlotStatus.AVAILABLE &&
      this._participants.length < this._capacity &&
      this._startTime > new Date()
    );
  }
    public addParticipants(userId: string) {
        if (!this.canBeBooked) throw new Error(SLOT_MESSAGES.SLOT_IS_FULL);
        if (this._participants.includes(userId)) throw new Error(SLOT_MESSAGES.USER_ALREADY_BOOKED);

        this._participants.push(userId);

        if (this._participants.length >= this._capacity) {
            this._status = SlotStatus.BOOKED;
        }
    }
    public completeSession() {
        this._status = SlotStatus.COMPLETED;
    }

    public cancelSession() {
        this._status = SlotStatus.CANCELLED;
    }
}