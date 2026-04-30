import { AttendanceStatus } from "@/domain/constants/session.constants";

export interface IBookingProps {
    id?: string;
    slotId: string;
    userId: string;
    cumulativeMinutes?: number;
    lastJoinedAt?: Date | null;
    attendanceStatus?: AttendanceStatus;
    isPayoutProcessed?: boolean;
    creditValueAtPurchase?: number;
    sessionType?: string;
}

export class BookingEntity {
    private readonly _id?: string;
    private readonly _slotId: string;
    private readonly _userId: string;
    private _cumulativeMinutes: number;
    private _lastJoinedAt?: Date;
    private _attendanceStatus: AttendanceStatus;
    private _isPayoutProcessed: boolean;
    private _creditValueAtPurchase: number;
    private _sessionType: string;

    constructor(props: IBookingProps) {
        this._id = props.id;
        this._slotId = props.slotId;
        this._userId = props.userId;
        this._cumulativeMinutes = props.cumulativeMinutes ?? 0;
        this._lastJoinedAt = props.lastJoinedAt ?? undefined;
        this._attendanceStatus = props.attendanceStatus ?? AttendanceStatus.PENDING;
        this._isPayoutProcessed = props.isPayoutProcessed ?? false;
        this._creditValueAtPurchase = props.creditValueAtPurchase ?? 0;
        this._sessionType = props.sessionType ?? "group";
    }

    get id() { return this._id; }
    get slotId() { return this._slotId; }
    get userId() { return this._userId; }
    get cumulativeMinutes() { return this._cumulativeMinutes; }
    get lastJoinedAt() { return this._lastJoinedAt; }
    get attendanceStatus() { return this._attendanceStatus; }
    get isPayoutProcessed() { return this._isPayoutProcessed; }
    get creditValueAtPurchase() { return this._creditValueAtPurchase; }
    get sessionType() { return this._sessionType; }

    public setLastJoinedAt(date: Date) {
        this._lastJoinedAt = date;
    }

    public updateCumulativeMinutes(minutes: number) {
        this._cumulativeMinutes += minutes;
    }

    public setAttendanceStatus(status: AttendanceStatus) {
        this._attendanceStatus = status;
    }

    public clearLastJoinedAt() {
        this._lastJoinedAt = undefined;
    }

    public markPayoutAsProcessed() {
        this._isPayoutProcessed = true;
    }
}
