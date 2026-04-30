import { Router } from "express";
import userAuthRoutes from "./auth/user-auth.routes";
import adminAuthRoutes from "./admin/admin-auth.routes";
import adminReportRoutes from "./admin/admin-report.routes";
import adminFinanceRoutes from "./admin/admin-finance.routes";
import userRoutes from "./user/user.routes";


import onboardingRoutes from "./auth/onboarding.routes";
import trainerRoutes from "./trainer/trainer.routes";
import { videoControllers } from "@/infrastructure/di/video/video.di";

import { asyncHandler } from "@/presentation/middleware/asyncHandler";

const router = Router();

router.use("/auth", userAuthRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/admin", adminAuthRoutes);
router.use("/admin/reports", adminReportRoutes);
router.use("/admin/finance", adminFinanceRoutes);
router.use("/user",userRoutes);

router.use("/trainer",trainerRoutes);

router.post("/webhooks/livekit", asyncHandler((req, res) => videoControllers.livekitWebhookController.handleWebhook(req, res)));

export default router;
