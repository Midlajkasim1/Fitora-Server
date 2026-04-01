export class UserWeightProgressRequestDTO{
    userId!:string;
    weight!:number;
    constructor(data:UserWeightProgressRequestDTO){
        Object.assign(this,data);
    }
}