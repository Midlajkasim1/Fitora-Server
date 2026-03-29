import { PlanSessionType, SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";



export class SubscriptionPlanEntity{
    private readonly _id?:string;
    private _name:string;
    private _price: number | string;
    private _billingCycle: string;
    private _description: string;
    private _totalPurchaseUser?: number;
    private _status: SubscriptionPlanStatus;
    private _createdAt?: Date;
    private _sessionType: PlanSessionType;
    private _sessionCredits: number;
    private _aiWorkoutLimit: number;
    private _aiDietLimit: number;
    private constructor(props:{
        id?:string;
        name:string;
        price: number | string;
        billingCycle: string;
        description: string;
        totalPurchaseUser?: number;
        status: SubscriptionPlanStatus;
        createdAt?: Date;
        sessionType:PlanSessionType;
        sessionCredits: number;
        aiWorkoutLimit: number;
        aiDietLimit: number;
    }){
        this._id=props.id;
        this._name = props.name;
        this._price = props.price;
        this._billingCycle = props.billingCycle;
        this._totalPurchaseUser = props.totalPurchaseUser || 0;
        this._description = props.description;
        this._status = props.status;
        this._createdAt = props.createdAt || new Date();
        this._sessionType = props.sessionType;
        this._sessionCredits = props.sessionCredits;
        this._aiWorkoutLimit = props.aiWorkoutLimit;
        this._aiDietLimit = props.aiDietLimit;
    }
    static create(props:{
        id?:string;
        name:string;
        price:number | string;
        billingCycle: string;
        description: string;
        totalPurchaseUser?: number;
        status?: SubscriptionPlanStatus;
        createdAt?: Date;
        sessionType:PlanSessionType;
        sessionCredits: number;
        aiWorkoutLimit: number;
        aiDietLimit: number
    }):SubscriptionPlanEntity{
        return new SubscriptionPlanEntity({
            ...props,
            status: props.status ?? SubscriptionPlanStatus.ACTIVE,
            totalPurchaseUser: props.totalPurchaseUser ?? 0,
            sessionType: props.sessionType ?? PlanSessionType.GROUP,
            sessionCredits: props.sessionCredits ?? 0,
            aiWorkoutLimit: props.aiWorkoutLimit ?? 0,
            aiDietLimit: props.aiDietLimit ?? 0
        });
    }
    get id(){return this._id;}
    get name() { return this._name; }
    get price() { return this._price; }
    get billingCycle() { return this._billingCycle; }
    get totalPurchaseUser() { return this._totalPurchaseUser; }
    get description() { return this._description; }
    get status() { return this._status; }
    get sessionType() { return this._sessionType; }
    get sessionCredits() { return this._sessionCredits; }
    get aiWorkoutLimit() { return this._aiWorkoutLimit; }
    get aiDietLimit() { return this._aiDietLimit; }
    get createdAt() { return this._createdAt; }

    toggleStatus():void {
        this._status =
          this._status === SubscriptionPlanStatus.ACTIVE
            ? SubscriptionPlanStatus.INACTIVE
            : SubscriptionPlanStatus.ACTIVE;
      }
}