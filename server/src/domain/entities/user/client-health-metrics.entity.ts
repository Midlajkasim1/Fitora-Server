
export class HealthMetricsEntity {
  private readonly _id?: string;
  private readonly _userId: string;
  private readonly _height: number;
  private  _weight: number;
  private readonly _targetWeight: number;
  private readonly _primaryGoal: string;
  private _updatedAt:Date;

  constructor(props: {
    id?: string;
    userId: string;
    height: number;
    weight: number;
    targetWeight: number;
    primaryGoal: string;
    updateAt:Date;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._height = props.height;
    this._weight = props.weight;
    this._targetWeight = props.targetWeight;
    this._primaryGoal = props.primaryGoal;
    this._updatedAt = props.updateAt;
  }

  static create(props: {
    userId: string;
    height: number;
    weight: number;
    targetWeight: number;
    primaryGoal: string;
    updateAt:Date
  }): HealthMetricsEntity {
    return new HealthMetricsEntity(props);
  }

  get id() { return this._id; }
  get userId() { return this._userId; }
  get height() { return this._height; }
  get weight() { return this._weight; }
  get targetWeight() { return this._targetWeight; }
  get primaryGoal() { return this._primaryGoal; }
  get updatedAt() { return this._updatedAt; }
}