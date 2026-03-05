import { SubscriptionStatus } from "@/domain/constants/subscription.constants";

export class SubscriptionEntity {
    private readonly _id?: string;
    private _planId: string;
    private _userId: string;
    private _status: SubscriptionStatus;
    private _startDate: Date;
    private _endDate: Date;

    constructor(props: {
        id?: string;
        planId: string;
        userId: string;
        status: SubscriptionStatus;
        startDate: Date;
        endDate: Date;
    }) {
        this._id = props.id;
        this._planId = props.planId;
        this._userId = props.userId;
        this._status = props.status;
        this._startDate = props.startDate;
        this._endDate = props.endDate;
    }

    static create(props: { 
        planId: string;
        userId: string;
        endDate: Date 
        }): SubscriptionEntity {
        return new SubscriptionEntity({
            ...props,
            status: SubscriptionStatus.ACTIVE,
            startDate: new Date(),
        });
    }

    get id() { return this._id; }
    get planId() { return this._planId; }
    get userId() { return this._userId; }
    get status() { return this._status; }
    get startDate() { return this._startDate; }
    get endDate() { return this._endDate; }
}