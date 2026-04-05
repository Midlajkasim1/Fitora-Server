export interface IMeal {
    name: string;
    time: string;
    foods: string[];
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    notes?: string;
}

export interface IDietDay {
    day: string;
    meals: IMeal[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    waterIntake: number;
    notes?: string;
}

export class AiDietPlanEntity {
    private readonly _id?: string;
    private _userId: string;
    private _title: string;
    private _description: string;
    private _weeklyPlan: IDietDay[];
    private _createdAt: Date;

    constructor(props: {
        id?: string;
        userId: string;
        title: string;
        description: string;
        weeklyPlan: IDietDay[];
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
        weeklyPlan: IDietDay[];
    }): AiDietPlanEntity {
        return new AiDietPlanEntity(props);
    }

    get id() { return this._id; }
    get userId() { return this._userId; }
    get title() { return this._title; }
    get description() { return this._description; }
    get weeklyPlan() { return this._weeklyPlan; }
    get createdAt() { return this._createdAt; }
}