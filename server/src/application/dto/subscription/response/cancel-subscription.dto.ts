
export class CancelSubscriptionResponseDTO{
    message!:string;
    constructor(data:CancelSubscriptionResponseDTO){
        Object.assign(this,data);
    }
}