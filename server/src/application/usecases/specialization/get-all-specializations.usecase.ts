import { GetSpecializationRequest } from "@/application/dto/specialization/request/get-specialization.dto";
import { GetSpecializationResponseDTO } from "@/application/dto/specialization/response/get-specialization.dto";
import { SpecializationManagementDTO } from "@/application/dto/specialization/response/specialization-management.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SPECIALIZATION_MESSAGES } from "@/domain/constants/messages.constants";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";


export class GetAllSpecializationUsecase implements IBaseUseCase<GetSpecializationRequest,GetSpecializationResponseDTO>{
    constructor(
        private readonly _specializationRepository:ISpecialization
    ){}
    async execute(dto: GetSpecializationRequest): Promise<GetSpecializationResponseDTO> {
      const {data, total} = await this._specializationRepository.findAllSP(dto);

      const specializationListItem : SpecializationManagementDTO[] = data.map((specialization)=>{
      if(!specialization.id){
      throw new Error(SPECIALIZATION_MESSAGES.SPECIALIZATION_ID_MISSING);
      }
      return new SpecializationManagementDTO({
        id:specialization.id, 
        name:specialization.name,
        description:specialization.description,
        imageUrl:specialization.imageUrl,
        status:specialization.status

      });
      });
   return new GetSpecializationResponseDTO({
   specialization:specializationListItem,
    total
   });
    }
}