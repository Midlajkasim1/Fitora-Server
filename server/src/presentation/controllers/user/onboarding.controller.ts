import { Request, Response } from "express";
import { CompleteUserOnboardingUseCase } from "@/application/usecases/auth/onboarding/complete-user-onboarding.usecase";
import { CompleteTrainerOnboardingUseCase } from "@/application/usecases/auth/onboarding/complete-trainer-onboarding.usecase";
import { userOnboardingSchema } from "@/infrastructure/validators/user/onboarding/user-onboarding.validator";
import { trainerOnboardingSchema } from "@/infrastructure/validators/user/onboarding/trainer-onboarding";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
export class OnboardingController {
  constructor(
    private readonly userOnboardingUseCase: CompleteUserOnboardingUseCase,
    private readonly trainerOnboardingUseCase: CompleteTrainerOnboardingUseCase
  ) { }

async completeUser(req: Request, res: Response): Promise<Response> {
  try {
    const validatedData = userOnboardingSchema.parse(req.body);
    const result = await this.userOnboardingUseCase.execute(validatedData);
    
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
      const result = await this.trainerOnboardingUseCase.execute(validatedData, uploadedFiles);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.errors || error.message
      });
    }
  }
}