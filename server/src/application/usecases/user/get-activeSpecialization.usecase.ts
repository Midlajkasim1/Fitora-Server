import { GetActiveSpecializationResponse } from "@/application/dto/specialization/response/getActive-specialization.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";
import { SpecializationStatus } from "@/domain/constants/auth.constants";

export class GetActiveSpecializationUseCase implements IBaseUseCase<void, GetActiveSpecializationResponse> {

  constructor(
    private readonly _specializationRepository: ISpecialization
  ) {}

  async execute(): Promise<GetActiveSpecializationResponse> {

    const { specializations } =
      await this._specializationRepository.findAll({
        page: 1,
        limit: 100,
        status: SpecializationStatus.ACTIVE
      });

    const result = specializations.map(spec => {
      if (!spec.id) {
        throw new Error("Specialization id missing");
      }

      return {
        id: spec.id,
        name: spec.name,
        
      };
    });

    return {
      specialization: result
    };
  }
}