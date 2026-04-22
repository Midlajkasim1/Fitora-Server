export class TrainerPayoutEntity {
    private readonly _id?: string;
    private readonly _trainerId: string;
    private readonly _slotId: string;
    private readonly _amount: number;
    private readonly _platformFee: number;
    private readonly _totalAmount: number;
    private readonly _status: 'PENDING' | 'PAID';
    private readonly _createdAt?: Date;

    constructor(props: {
        id?: string;
        trainerId: string;
        slotId: string;
        amount: number;
        platformFee: number;
        totalAmount: number;
        status: 'PENDING' | 'PAID';
        createdAt?: Date;
    }) {
        this._id = props.id;
        this._trainerId = props.trainerId;
        this._slotId = props.slotId;
        this._amount = props.amount;
        this._platformFee = props.platformFee;
        this._totalAmount = props.totalAmount;
        this._status = props.status;
        this._createdAt = props.createdAt || new Date();
    }

    get id() { return this._id; }
    get trainerId() { return this._trainerId; }
    get slotId() { return this._slotId; }
    get amount() { return this._amount; }
    get platformFee() { return this._platformFee; }
    get totalAmount() { return this._totalAmount; }
    get status() { return this._status; }
    get createdAt() { return this._createdAt; }
}
