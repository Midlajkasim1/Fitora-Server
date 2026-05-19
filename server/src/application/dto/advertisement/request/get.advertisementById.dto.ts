
export class GetAdvertisementByIdRequest{
    adId!:string;
    constructor(data:GetAdvertisementByIdRequest){
        Object.assign(this,data);
    }
}