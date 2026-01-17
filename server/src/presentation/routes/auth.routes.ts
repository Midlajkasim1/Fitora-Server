import { Router } from "express";
import { controllers } from "@/infrastructure/di/controllers";

const router = Router();

router.post("/auth/register", (req, res) =>
  controllers.authController.register(req, res)
);

router.post("/auth/verify-otp", (req, res) =>
  controllers.authController.verifyOtp(req, res)
);

export default router;
