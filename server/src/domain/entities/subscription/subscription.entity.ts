import { SubscriptionStatus } from "@/domain/constants/subscription.constants";

export class SubscriptionEntity {
    private readonly _id?: string;
    private _planId: string;
    private _userId: string;
    private _status: SubscriptionStatus;
    private _startDate: Date;
    private _endDate: Date;
    private _usedCredits:number;

    constructor(props: {
        id?: string;
        planId: string;
        userId: string;
        status: SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        usedCredits?:number;
    }) {
        this._id = props.id;
        this._planId = props.planId;
        this._userId = props.userId;
        this._status = props.status;
        this._startDate = props.startDate;
        this._endDate = props.endDate;
        this._usedCredits = props.usedCredits ||0;
    }

    public static calculateExpireDate(startDate:Date,billingCycle:string): Date {
        const endDate = new Date(startDate);
        const cycle = billingCycle.toLowerCase();
        if(cycle.includes("year")){
            endDate.setFullYear(endDate.getFullYear()+1);
        }else if(cycle.includes("6 months")){
            endDate.setMonth(endDate.getMonth()+6);
        }else if (cycle.includes("month")){
            endDate.setMonth(endDate.getMonth()+1);
        }else{
            const days = parseInt(cycle);
            endDate.setDate(endDate.getDate()+ (isNaN(days) ? 30 : days));
        }
        return endDate;
    }
    static create(props: { 
        planId: string;
        userId: string;
        startDate:Date;
        endDate: Date 
        }): SubscriptionEntity {
        return new SubscriptionEntity({
            ...props,
            status: SubscriptionStatus.PENDING,
        });
    }

    get id() { return this._id; }
    get planId() { return this._planId; }
    get userId() { return this._userId; }
    get status() { return this._status; }
    get startDate() { return this._startDate; }
    get endDate() { return this._endDate; }
    get usedCredit(){return this._usedCredits;}
}