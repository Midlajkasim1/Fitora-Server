

export class GetWorkoutPlanRequestDTO{
    userId!:string;
    constructor(data:GetWorkoutPlanRequestDTO){
        Object.assign(this,data);
    }
}