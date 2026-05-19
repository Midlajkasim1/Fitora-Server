
export class BookSlotRequestDTO{
    slotId!:string;
    userId!:string;
    constructor(data:BookSlotRequestDTO){
        Object.assign(this,data);
    }
}