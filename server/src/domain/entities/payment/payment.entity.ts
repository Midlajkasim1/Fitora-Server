import { PaymentStatus } from "@/domain/constants/payment.constants";

export class PaymentEntity {
    private readonly _id?: string;
    private _userId: string;
    private _subscriptionId?: string;
    private _paymentMethod: string;
    private _amount: number;
    private _trainerAmount: number;
    private _status: PaymentStatus;
    private _providerPaymentId?: string;
    private _createdAt?: Date;

    constructor(props: {
        id?: string;
        userId: string;
        subscriptionId?: string;
        paymentMethod: string;
        amount: number;
        trainerAmount?: number;
        status: PaymentStatus;
        providerPaymentId?: string;
        createdAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._subscriptionId = props.subscriptionId;
        this._paymentMethod = props.paymentMethod;
        this._amount = props.amount;
        this._trainerAmount = props.trainerAmount || 0;
        this._status = props.status;
        this._providerPaymentId = props.providerPaymentId;
        this._createdAt = props.createdAt || new Date();
    }

    static create(props: { 
        userId: string;
         amount: number; 
         trainerAmount?: number;
         paymentMethod: string;
         subscriptionId?: string ;
         providerPaymentId?: string;
        }): PaymentEntity {
        return new PaymentEntity({
            ...props,
            status: PaymentStatus.PENDING,
        });
    }

    get id() { return this._id; }
    get userId() { return this._userId; }
    get subscriptionId(){return this._subscriptionId;}
    get paymentMethod() { return this._paymentMethod; }
    get amount() { return this._amount; }
    get trainerAmount() { return this._trainerAmount; }
    get status() { return this._status; }
    get providerPaymentId() { return this._providerPaymentId; }
    get createdAt(){return this._createdAt;}
}