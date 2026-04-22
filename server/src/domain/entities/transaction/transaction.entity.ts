export enum TransactionType {
    SUBSCRIPTION_PURCHASE = "Subscription Purchase",
    SESSION_PAYOUT = "Session Payout",
    PLATFORM_COMMISSION = "Platform Commission",
    AD_REVENUE = "Ad Revenue",
    WITHDRAWAL = "Withdrawal"
}

export enum TransactionStatus {
    SUCCESS = "Success",
    PENDING = "Pending",
    FAILED = "Failed"
}

export class TransactionEntity {
    private readonly _id?: string;
    private readonly _userId?: string; // Optional: could be "SYSTEM" or system user
    private readonly _entityName: string; // e.g., "Sarah Jenkins", "Google AdSense"
    private readonly _amount: number;
    private readonly _type: TransactionType;
    private readonly _status: TransactionStatus;
    private readonly _description: string;
    private readonly _referenceId?: string;
    private readonly _createdAt?: Date;

    constructor(props: {
        id?: string;
        userId?: string;
        entityName: string;
        amount: number;
        type: TransactionType;
        status: TransactionStatus;
        description: string;
        referenceId?: string;
        createdAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._entityName = props.entityName;
        this._amount = props.amount;
        this._type = props.type;
        this._status = props.status;
        this._description = props.description;
        this._referenceId = props.referenceId;
        this._createdAt = props.createdAt;
    }

    static create(props: {
        userId?: string;
        entityName: string;
        amount: number;
        type: TransactionType;
        description: string;
        referenceId?: string;
    }): TransactionEntity {
        return new TransactionEntity({
            ...props,
            status: TransactionStatus.SUCCESS
        });
    }

    get id() { return this._id; }
    get userId() { return this._userId; }
    get entityName() { return this._entityName; }
    get amount() { return this._amount; }
    get type() { return this._type; }
    get status() { return this._status; }
    get description() { return this._description; }
    get referenceId() { return this._referenceId; }
    get createdAt() { return this._createdAt; }
}
