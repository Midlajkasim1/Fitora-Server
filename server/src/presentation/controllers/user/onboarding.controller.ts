import { TrainerOnboardingDTO } from "@/application/dto/auth/onboarding/request/trainer.onboarding.dto";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer.upload.file.dto";
import { UserOnboardingDTO } from "@/application/dto/auth/onboarding/request/user.onboarding.dto";
import { OnboardingResponseDTO } from "@/application/dto/auth/onboarding/response/onboarding.success.dto";
import { GetActiveSpecializationResponse } from "@/application/dto/specialization/response/get.active.specialization.dto";
import { IBaseUseCase } from "@/application/interfaces/base.usecase.interface";
import { HttpStatus } from "@/domain/constants/http.status.constants";
import { trainerOnboardingSchema } from "@/infrastructure/validators/user/onboarding/trainer-onboarding";
import { userOnboardingSchema } from "@/infrastructure/validators/user/onboarding/user-onboarding.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";
import { ForbiddenError } from "@/shared/errors/forbidden.error";
export class OnboardingController {
  constructor(
    private readonly _userOnboardingUseCase: IBaseUseCase<UserOnboardingDTO,OnboardingResponseDTO>,
    private readonly _trainerOnboardingUseCase: IBaseUseCase<TrainerOnboardingDTO,OnboardingResponseDTO,UploadFileDTO[]>,
    private readonly _getActiveSpecializationUseCase:IBaseUseCase<void, GetActiveSpecializationResponse>
  ) { }

async completeUser(req: Request, res: Response): Promise<Response> {

    const validatedData = userOnboardingSchema.parse(req.body);
    const authenticatedSessionId = req.user?.id;
    const targetUserId = validatedData.userId;
    if (targetUserId !== authenticatedSessionId) {
        throw new ForbiddenError("You are not authorized to complete onboarding for this user profile.");
    }
    const result = await this._userOnboardingUseCase.execute({
        ...validatedData,
        authenticatedSessionId
    });
    
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));

}

  async completeTrainer(req: Request, res: Response): Promise<Response> {

      const validatedData = trainerOnboardingSchema.parse(req.body);
      const authenticatedSessionId = req.user?.id;
      const targetUserId = validatedData.userId;
      if (targetUserId !== authenticatedSessionId) {
          throw new ForbiddenError("You are not authorized to complete onboarding for this user profile.");
      }

      const allFiles = (req.files as Express.Multer.File[]) || [];
      const uploadedFiles: UploadFileDTO[] = allFiles.map((file) => ({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));
      const result = await this._trainerOnboardingUseCase.execute(
        {
          ...validatedData,
          authenticatedSessionId
        },
        uploadedFiles
      );

      return res.status(HttpStatus.OK).json(ApiResponse.success(result));
 
  }
  async getActiveSpecializations(req:Request,res:Response):Promise<Response>{
    const result = await this._getActiveSpecializationUseCase.execute();
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
}
