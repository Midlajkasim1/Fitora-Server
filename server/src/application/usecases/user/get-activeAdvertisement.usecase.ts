import { GetActiveAdversitsementResponsetDTO } from "@/application/dto/advertisement/response/get-activeAdvertisement.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IAdvertisementRepository } from "@/domain/interfaces/repositories/advertisement.repository";


export class GetActiveAdvertisementUseCase implements IBaseUseCase<void,GetActiveAdversitsementResponsetDTO>{
    constructor(
        private readonly _advertisementRepository:IAdvertisementRepository
    ){}
    async execute(): Promise<GetActiveAdversitsementResponsetDTO> {
        const activeads= await this._advertisementRepository.findActiveAds();
        const mappedAds = activeads.map((ad)=>({
            id:ad.id!,
            brandName:ad.brandName,
            brandLink:ad.brandLink,
            bannerImages:ad.bannerImages,
            description:ad.description

        }));
        return {
            advertisement:mappedAds
        };
    }
}