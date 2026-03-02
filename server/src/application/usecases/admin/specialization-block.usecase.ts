import { UpdateStatusRequestDTO } from "@/application/dto/specialization/request/updateStatus-specialization.dto";
import { UpdateStatusResponseDTO } from "@/application/dto/specialization/response/updateStatus-specialization.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SPECIALIZATION_MESSAGES } from "@/domain/constants/messages.constants";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";


export class BlockSpecializationUSeCase implements IBaseUseCase<UpdateStatusRequestDTO,UpdateStatusResponseDTO>{
    constructor(
        private readonly _specializationRepository:ISpecialization
    ){}
    async execute(dto: UpdateStatusRequestDTO): Promise<UpdateStatusResponseDTO> {
        const specialization = await this._specializationRepository.findById(dto.specializationId);
        if(!specialization){
            throw new Error(SPECIALIZATION_MESSAGES.SPECIALIZATION_NOT_FOUND);
        }

      specialization.toggleStatus();
      const newStatus = specialization.status;
      await this._specializationRepository.updateStatus(specialization.id!,newStatus);
    return {
       specializationId:specialization.id!,
       name:specialization.name,
       status:newStatus,
       message:SPECIALIZATION_MESSAGES.SPECIALIZATION_STATUS_UPDATED(newStatus)

    };

    }
}