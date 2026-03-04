

export interface UpdateSubscriptionRequestDTO{
    id:string;
    name:string;
    price?:number | string;
    billingCycle?:string;
    description?:string;

}