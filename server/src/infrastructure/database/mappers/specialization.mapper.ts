import { SpecializationEntity } from "@/domain/entities/specialization/specialization.entity";
import { ISpecializationDocument } from "../interfaces/specialization-interface";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";


export class SpecializationMapper implements IMapper<SpecializationEntity,ISpecializationDocument>{
    toEntity(doc:ISpecializationDocument) :SpecializationEntity {
    return  SpecializationEntity.create({
        id:doc._id.toString(),
        name:doc.name,
        description:doc.description,
        imageUrl:doc.imageUrl,
        status:doc.status,
        createdAt:doc.createdAt,
        updatedAt:doc.updatedAt

    });
   }
    toMongo(entity:SpecializationEntity):Partial<ISpecializationDocument>{
   return {
    name:entity.name,
    description:entity.description,
    imageUrl:entity.imageUrl,
    status:entity.status,
    createdAt:entity.createdAt,
    updatedAt:entity.updatedAt
   };
   }
}

