import { AdvertisementEntity } from "@/domain/entities/advertisement/advertisement.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { IAdvertisementDocument } from "../interfaces/IAdvertisement.interface";



export class AdvertisementMapper implements IMapper<AdvertisementEntity,IAdvertisementDocument>{
    toEntity(doc: IAdvertisementDocument): AdvertisementEntity {
        return new AdvertisementEntity({
            id:doc._id.toString(),
            brandName:doc.brandName,
            startDate:doc.startDate,
            expiryDate:doc.expiryDate,
            brandLink:doc.brandLink,
            bannerImages:doc.bannerImages,
            description:doc.description ?? undefined,
            status:doc.status,
            createdAt:doc.createdAt,
            updatedAt:doc.updatedAt
        });

    }
    toMongo(entity: AdvertisementEntity): Partial<IAdvertisementDocument> {
        return{
          brandName:entity.brandName,
          startDate:entity.startDate,
          expiryDate:entity.expiryDate,
          brandLink:entity.brandLink,
          bannerImages:entity.bannerImages,
          description:entity.description ?? "",
          status:entity.status,
          createdAt:entity.createdAt,
          updatedAt:entity.updatedAt
        };
    }
}