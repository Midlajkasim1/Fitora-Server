

export class GetTrainerUsersRequestDTO{
    trainerId!:string;
    page!:number;
    limit!:number;
    search?:string;
    constructor(data:GetTrainerUsersRequestDTO){
        Object.assign(this,data);
    }
}