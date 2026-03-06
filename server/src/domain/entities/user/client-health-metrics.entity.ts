
export class HealthMetricsEntity {
  private readonly _id?: string;
  private readonly _userId: string;
  private readonly _height: number;
  private readonly _weight: number;
  private readonly _targetWeight: number;
  private readonly _primaryGoal: string;

  constructor(props: {
    id?: string;
    userId: string;
    height: number;
    weight: number;
    targetWeight: number;
    primaryGoal: string;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._height = props.height;
    this._weight = props.weight;
    this._targetWeight = props.targetWeight;
    this._primaryGoal = props.primaryGoal;
  }

  static create(props: {
    userId: string;
    height: number;
    weight: number;
    targetWeight: number;
    primaryGoal: string;
  }): HealthMetricsEntity {
    return new HealthMetricsEntity(props);
  }

  get id() { return this._id; }
  get userId() { return this._userId; }
  get height() { return this._height; }
  get weight() { return this._weight; }
  get targetWeight() { return this._targetWeight; }
  get primaryGoal() { return this._primaryGoal; }
}