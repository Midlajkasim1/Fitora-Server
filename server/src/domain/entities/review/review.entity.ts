export class ReviewEntity {
  private readonly _id?: string;
  private readonly _bookingId: string;
  private readonly _userId: string;
  private readonly _trainerId: string;
  private readonly _rating: number;
  private readonly _comment?: string;
  private readonly _createdAt?: Date;

  constructor(props: {
    id?: string;
    bookingId: string;
    userId: string;
    trainerId: string;
    rating: number;
    comment?: string;
    createdAt?: Date;
  }) {
    this._id = props.id;
    this._bookingId = props.bookingId;
    this._userId = props.userId;
    this._trainerId = props.trainerId;
    this._rating = props.rating;
    this._comment = props.comment;
    this._createdAt = props.createdAt;
  }

  get id() { return this._id; }
  get bookingId() { return this._bookingId; }
  get userId() { return this._userId; }
  get trainerId() { return this._trainerId; }
  get rating() { return this._rating; }
  get comment() { return this._comment; }
  get createdAt() { return this._createdAt; }
}
