import { Request, Response } from "express";
import { userOnboardingSchema } from "@/infrastructure/validators/user/onboarding/user-onboarding.validator";
import { trainerOnboardingSchema } from "@/infrastructure/validators/user/onboarding/trainer-onboarding";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserOnboardingDTO } from "@/application/dto/auth/onboarding/request/user-onboarding.dto";
import { OnboardingResponseDTO } from "@/application/dto/auth/onboarding/response/onboarding-success.dto";
import { TrainerOnboardingDTO } from "@/application/dto/auth/onboarding/request/trainer-onboarding.dto";
import { GetActiveSpecializationResponse } from "@/application/dto/specialization/response/getActive-specialization.dto";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
export class OnboardingController {
  constructor(
    private readonly _userOnboardingUseCase: IBaseUseCase<UserOnboardingDTO,OnboardingResponseDTO>,
    private readonly _trainerOnboardingUseCase: IBaseUseCase<TrainerOnboardingDTO,OnboardingResponseDTO,UploadFileDTO[]>,
    private readonly _getActiveSpecializationUseCase:IBaseUseCase<void, GetActiveSpecializationResponse>
  ) { }

async completeUser(req: Request, res: Response): Promise<Response> {

    const validatedData = userOnboardingSchema.parse(req.body);
    const result = await this._userOnboardingUseCase.execute(validatedData);
    
    return res.status(200).json(ApiResponse.success(result));

}

  async completeTrainer(req: Request, res: Response): Promise<Response> {

      const validatedData = trainerOnboardingSchema.parse(req.body);

      const allFiles = (req.files as Express.Multer.File[]) || [];
      const uploadedFiles: UploadFileDTO[] = allFiles.map((file) => ({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));
      const result = await this._trainerOnboardingUseCase.execute(validatedData, uploadedFiles);

      return res.status(200).json(ApiResponse.success(result));
 
  }
  async getActiveSpecializations(req:Request,res:Response):Promise<Response>{
    const result = await this._getActiveSpecializationUseCase.execute();
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
}
