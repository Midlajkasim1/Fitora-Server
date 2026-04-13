

export class MarkAllReadRequestDTO{
    userId!:string;
    constructor(data:MarkAllReadRequestDTO){
        Object.assign(this,data);
    }
}