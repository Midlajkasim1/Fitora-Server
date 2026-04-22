import { ReportStatus, ReportType } from "@/domain/constants/report.constants";

export class ReportEntity {
    private readonly _id?: string;
    private readonly _reporterId: string;
    private readonly _reportedId: string; // Could be TrainerId, UserId, or SlotId
    private readonly _type: ReportType;
    private readonly _status: ReportStatus;
    private readonly _description: string;
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;

    constructor(props: {
        id?: string;
        reporterId: string;
        reportedId: string;
        type: ReportType;
        status: ReportStatus;
        description: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._reporterId = props.reporterId;
        this._reportedId = props.reportedId;
        this._type = props.type;
        this._status = props.status;
        this._description = props.description;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    get id() { return this._id; }
    get reporterId() { return this._reporterId; }
    get reportedId() { return this._reportedId; }
    get type() { return this._type; }
    get status() { return this._status; }
    get description() { return this._description; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
}
