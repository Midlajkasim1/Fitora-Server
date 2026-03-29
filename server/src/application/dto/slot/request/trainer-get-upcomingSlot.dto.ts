


export class GetTrainerUpcomingSlotRequestDTO{
    trainerId!:string;
    page!:number;
    limit!:number;
    constructor(data:GetTrainerUpcomingSlotRequestDTO){
        Object.assign(this,data);
    }
}