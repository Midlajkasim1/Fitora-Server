import { Request, Response } from "express";
import { userOnboardingSchema } from "@/infrastructure/validators/user/onboarding/user-onboarding.validator";
import { trainerOnboardingSchema } from "@/infrastructure/validators/user/onboarding/trainer-onboarding";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserOnboardingDTO } from "@/application/dto/auth/onboarding/request/user-onboarding.dto";
import { OnboardingResponseDTO } from "@/application/dto/auth/onboarding/response/onboarding-success.dto";
import { TrainerOnboardingDTO } from "@/application/dto/auth/onboarding/request/trainer-onboarding.dto";
export class OnboardingController {
  constructor(
    private readonly _userOnboardingUseCase: IBaseUseCase<UserOnboardingDTO,OnboardingResponseDTO>,
    private readonly _trainerOnboardingUseCase: IBaseUseCase<TrainerOnboardingDTO,OnboardingResponseDTO,UploadFileDTO[]>
  ) { }

async completeUser(req: Request, res: Response): Promise<Response> {
  try {
    const validatedData = userOnboardingSchema.parse(req.body);
    const result = await this._userOnboardingUseCase.execute(validatedData);
    
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      error: error.errors || error.message 
    });
  }
}

  async completeTrainer(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = trainerOnboardingSchema.parse(req.body);

      const allFiles = (req.files as Express.Multer.File[]) || [];
      const uploadedFiles: UploadFileDTO[] = allFiles.map((file) => ({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));
      const result = await this._trainerOnboardingUseCase.execute(validatedData, uploadedFiles);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.errors || error.message
      });
    }
  }
}