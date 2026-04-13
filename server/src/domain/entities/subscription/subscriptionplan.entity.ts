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
    private _hasAiWorkout: boolean;
    private _hasAiDiet: boolean;
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
        hasAiWorkout: boolean;
        hasAiDiet: boolean;
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
        this._hasAiWorkout = props.hasAiWorkout;
        this._hasAiDiet = props.hasAiDiet;
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
        hasAiWorkout: boolean;
        hasAiDiet: boolean
    }):SubscriptionPlanEntity{
        return new SubscriptionPlanEntity({
            ...props,
            status: props.status ?? SubscriptionPlanStatus.ACTIVE,
            totalPurchaseUser: props.totalPurchaseUser ?? 0,
            sessionType: props.sessionType ?? PlanSessionType.GROUP,
            sessionCredits: props.sessionCredits ?? 0,
            hasAiWorkout: props.hasAiWorkout ?? false,
            hasAiDiet: props.hasAiDiet ?? false
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
    get hasAiWorkout() { return this._hasAiWorkout; }
    get hasAiDiet() { return this._hasAiDiet; }
    get createdAt() { return this._createdAt; }

    toggleStatus():void {
        this._status =
          this._status === SubscriptionPlanStatus.ACTIVE
            ? SubscriptionPlanStatus.INACTIVE
            : SubscriptionPlanStatus.ACTIVE;
      }
    //   public canAccessAiDiet(): boolean {
    //     return this._hasAiDiet > 0;
    // }

    // /**
    //  * Check if plan allows workout scheduling
    //  */
    // public canAccessAiWorkout(): boolean {
    //     return this._aiWorkoutLimit > 0;
    // }
}