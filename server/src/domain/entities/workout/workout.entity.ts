import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";

export class WorkoutEntity {
  private readonly _id?: string;
  private _title: string;
  private _description: string;
  private _videoUrl: string;
  private _thumbnailUrl?: string;
  private _specializationId: string;
  private _duration: number; 
  private _caloriesBurn: number;
  private _bodyFocus: string;
  private _difficulty: WorkoutDifficulty;
  private _status: WorkoutStatus;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  private constructor(props: {
    id?: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    specializationId: string;
    duration: number;
    bodyFocus: string; 
    caloriesBurn: number;
    difficulty: WorkoutDifficulty;
    status: WorkoutStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._videoUrl = props.videoUrl;
    this._thumbnailUrl = props.thumbnailUrl;
    this._specializationId = props.specializationId;
    this._duration = props.duration;
    this._bodyFocus=props.bodyFocus;
    this._caloriesBurn = props.caloriesBurn;
    this._difficulty = props.difficulty;
    this._status = props.status;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: {
    id?: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    bodyFocus:string;
    specializationId: string;
    duration: number;
    caloriesBurn: number;
    difficulty: WorkoutDifficulty;
    status?: WorkoutStatus;
  }) {
    return new WorkoutEntity({
      ...props,
      status: props.status ?? WorkoutStatus.ACTIVE
    });
  }

  get id() { return this._id; }
  get title() { return this._title; }
  get description() { return this._description; }
  get videoUrl() { return this._videoUrl; }
  get thumbnailUrl() { return this._thumbnailUrl; }
  get specializationId() { return this._specializationId; }
  get duration() { return this._duration; }
  get caloriesBurn() { return this._caloriesBurn; }
  get difficulty() { return this._difficulty; }
  get bodyFocus() {return this._bodyFocus;}
  get status() { return this._status; }
  get createdAt(){return this._createdAt;}
  get updatedAt(){return this._updatedAt;}

  toggleStatus() {
    this._status =
      this._status === WorkoutStatus.ACTIVE
        ? WorkoutStatus.BLOCKED
        : WorkoutStatus.ACTIVE;
  }
}