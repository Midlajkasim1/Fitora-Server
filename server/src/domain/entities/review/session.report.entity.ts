
export interface ISessionMetrics {
  caloriesBurned?: number;
  averageHeartRate?: number;
  intensityLevel?: "Low" | "Medium" | "High";
  customNotes?: Record<string, string | number>;
}


export class SessionReportEntity {
  private readonly _id?: string;
  private readonly _bookingId: string;
  private readonly _content: string;
  private readonly _metrics: ISessionMetrics; 
  private readonly _isPrivate: boolean;

  constructor(props: {
    id?: string;
    bookingId: string;
    content: string;
    metrics: ISessionMetrics;
    isPrivate: boolean;
  }) {
    this._id = props.id;
    this._bookingId = props.bookingId;
    this._content = props.content;
    this._metrics = props.metrics;
    this._isPrivate = props.isPrivate;
  }

  get id() { return this._id; }
  get bookingId() { return this._bookingId; }
  get content() { return this._content; }
  get metrics() { return this._metrics; }
  get isPrivate() { return this._isPrivate; }
}
