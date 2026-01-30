import { Router } from "express";
import { onboardingControllers } from "@/infrastructure/di/user/onboarding/onboarding.controller";
import multer from "multer";
import { authenticate } from "@/presentation/middleware/auth.middleware";

const router = Router();
const controller = onboardingControllers.onboardingController;

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/trainer/complete", 
  upload.array("certificates"),authenticate, 
  (req, res) => controller.completeTrainer(req, res)
);

router.post("/user/complete", authenticate,(req, res) => controller.completeUser(req, res));

export default router;