
export class CancelSubscriptionRequestDTO{
    userId!:string;
    constructor(data:CancelSubscriptionRequestDTO){
        Object.assign(this,data);
    }
}