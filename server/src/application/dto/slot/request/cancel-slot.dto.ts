export class CancelBookingRequestDTO{
    slotId!:string;
    userId!:string;
    constructor(data:CancelBookingRequestDTO){
        Object.assign(this,data);
    }
}