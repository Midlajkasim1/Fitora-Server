import { onboardingControllers } from "@/infrastructure/di/user/onboarding/onboarding.controller";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { upload } from "@/presentation/middleware/multer.middleware";
import { Request, Response, Router } from "express";

const router = Router();

router.post(
  "/trainer/complete",
  upload.array("certificates"), userMiddlewares.authMiddleware, asyncHandler((req: Request, res: Response) =>
  onboardingControllers.onboardingController.completeTrainer(req, res))
);

router.post("/user/complete", userMiddlewares.authMiddleware, asyncHandler((req: Request, res: Response) =>
  onboardingControllers.onboardingController.completeUser(req, res))
);
router.get("/active-specialization",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  onboardingControllers.onboardingController.getActiveSpecializations(req,res)
));

export default router;