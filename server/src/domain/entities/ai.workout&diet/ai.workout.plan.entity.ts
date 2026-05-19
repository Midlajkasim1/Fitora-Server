export interface IWorkoutExercise {
    name: string;
    sets: number;
    reps: string | number;
    duration?: string;
    restTime: string;
    notes?: string;
}

export interface IWorkoutDay {
    day: string;
    focus: string;
    exercises: IWorkoutExercise[];
    warmup?: string;
    cooldown?: string;
    duration?: string;
    intensity?: string;
}

export class AiWorkoutPlanEntity {
    private readonly _id?: string;
    private _userId: string;
    private _title: string;
    private _description: string;
    private _weeklyPlan: IWorkoutDay[];
    private _createdAt: Date;

    constructor(props: {
        id?: string;
        userId: string;
        title: string;
        description: string;
        weeklyPlan: IWorkoutDay[];
        createdAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._title = props.title;
        this._description = props.description;
        this._weeklyPlan = props.weeklyPlan;
        this._createdAt = props.createdAt || new Date();
    }

    static create(props: {
        userId: string;
        title: string;
        description: string;
        weeklyPlan: IWorkoutDay[];
    }): AiWorkoutPlanEntity {
        return new AiWorkoutPlanEntity(props);
    }

    get id() { return this._id; }
    get userId() { return this._userId; }
    get title() { return this._title; }
    get description() { return this._description; }
    get weeklyPlan() { return this._weeklyPlan; }
    get createdAt() { return this._createdAt; }
}