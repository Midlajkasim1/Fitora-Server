
export interface ActiveAdData {
    id: string;
    brandName: string;
    brandLink: string;
    bannerImages: string[];
    description?: string;
}
export class GetActiveAdversitsementResponsetDTO{
    advertisement!:ActiveAdData[];
    constructor(data:GetActiveAdversitsementResponsetDTO){
        Object.assign(this,data);
    }

}