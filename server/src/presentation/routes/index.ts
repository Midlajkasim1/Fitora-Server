import { Router } from "express";
import userAuthRoutes from "./auth/user-auth.routes";
import adminAuthRoutes from "./admin/admin-auth.routes";
import userRoutes from "./user/user.routes";
import onboardingRoutes from "./auth/onboarding.routes";
import trainerRoutes from "./trainer/trainer.routes";
const router = Router();

router.use("/auth", userAuthRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/admin", adminAuthRoutes);
router.use("/user",userRoutes);
router.use("/trainer",trainerRoutes);





export default router;
