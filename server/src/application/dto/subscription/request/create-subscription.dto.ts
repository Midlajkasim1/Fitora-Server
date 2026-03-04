
export interface CreateSubscriptionRequestDTO{
    name:string;
    price:number | string;
    billingCycle:string;
    description:string;
}