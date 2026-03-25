import { GetSpecializationByIdRequestDTO } from "@/application/dto/specialization/request/get-specializationById.dto";
import { GetSpecializationByIdResponseDTO } from "@/application/dto/specialization/response/get-specializationById.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SPECIALIZATION_MESSAGES } from "@/domain/constants/messages.constants";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";



export class GetSpecializationByIdUseCase implements IBaseUseCase<GetSpecializationByIdRequestDTO,GetSpecializationByIdResponseDTO>{
    constructor(
        private readonly _specializationRepository: ISpecialization
    ){}
    async execute(dto: GetSpecializationByIdRequestDTO): Promise<GetSpecializationByIdResponseDTO> {
        const specializationId = await this._specializationRepository.findById(dto.id);
        if(!specializationId){
            throw new Error(SPECIALIZATION_MESSAGES.SPECIALIZATION_NOT_FOUND);
        }
        return new GetSpecializationByIdResponseDTO({
            id:specializationId.id!,
            name:specializationId.name,
            description:specializationId.description,
            imageUrl:specializationId.imageUrl,
            status:specializationId.status,
            createdAt:specializationId.createdAt!,
            updatedAt:specializationId.updatedAt!
        });
    }
}