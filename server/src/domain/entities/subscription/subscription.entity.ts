import { SubscriptionStatus } from "@/domain/constants/subscription.constants";



export class SubscriptionEntity{
    private readonly _id?:string;
    private _name:string;
    private _price: number | string;
    private _billingCycle: string;
    private _description: string;
    private _totalPurchaseUser?: number;
    private _status: SubscriptionStatus;
    private _createdAt?: Date;
    private constructor(props:{
        id?:string;
        name:string;
        price: number | string;
        billingCycle: string;
        description: string;
        totalPurchaseUser?: number;
        status: SubscriptionStatus;
        createdAt?: Date;
    }){
        this._id=props.id;
        this._name = props.name;
        this._price = props.price;
        this._billingCycle = props.billingCycle;
        this._totalPurchaseUser = props.totalPurchaseUser || 0;
        this._description = props.description;
        this._status = props.status;
        this._createdAt = props.createdAt || new Date();
    }
    static create(props:{
        id?:string;
        name:string;
        price:number | string;
        billingCycle: string;
        description: string;
        totalPurchaseUser?: number;
        status?: SubscriptionStatus;
        createdAt?: Date;
    }):SubscriptionEntity{
        return new SubscriptionEntity({
            ...props,
            status: props.status ?? SubscriptionStatus.ACTIVE,
            totalPurchaseUser: props.totalPurchaseUser ?? 0
        });
    }
    get id(){return this._id;}
    get name() { return this._name; }
    get price() { return this._price; }
    get billingCycle() { return this._billingCycle; }
    get totalPurchaseUser() { return this._totalPurchaseUser; }
    get description() { return this._description; }
    get status() { return this._status; }
    get createdAt() { return this._createdAt; }

    toggleStatus():void {
        this._status =
          this._status === SubscriptionStatus.ACTIVE
            ? SubscriptionStatus.INACTIVE
            : SubscriptionStatus.ACTIVE;
      }
}