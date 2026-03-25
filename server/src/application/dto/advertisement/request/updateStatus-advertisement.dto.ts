
export class UpdateStatusAdvertisementRequestDTO{
    adId!:string;
    constructor(data:Partial<UpdateStatusAdvertisementRequestDTO>){
        Object.assign(this,data);
    }
}