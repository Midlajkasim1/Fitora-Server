import { AttendanceStatus } from "@/domain/constants/session.constants";

export class BookingEntity {
    private readonly _id?: string;
    private readonly _slotId: string;
    private readonly _userId: string;
    private _cumulativeMinutes: number;
    private _lastJoinedAt?: Date;
    private _attendanceStatus: AttendanceStatus;

    constructor(props: {
        id?: string;
        slotId: string;
        userId: string;
        cumulativeMinutes?: number;
        lastJoinedAt?: Date;
        attendanceStatus?: AttendanceStatus;
    }) {
        this._id = props.id;
        this._slotId = props.slotId;
        this._userId = props.userId;
        this._cumulativeMinutes = props.cumulativeMinutes ?? 0;
        this._lastJoinedAt = props.lastJoinedAt;
        this._attendanceStatus = props.attendanceStatus ?? AttendanceStatus.PENDING;
    }

    get id() { return this._id; }
    get slotId() { return this._slotId; }
    get userId() { return this._userId; }
    get cumulativeMinutes() { return this._cumulativeMinutes; }
    get lastJoinedAt() { return this._lastJoinedAt; }
    get attendanceStatus() { return this._attendanceStatus; }

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
}
