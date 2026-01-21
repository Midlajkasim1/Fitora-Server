import { Router } from "express";
import userAuthRoutes from "./auth/user-auth.routes";
import adminAuthRoutes from "./admin/admin-auth.routes";

const router = Router();

router.use("/auth", userAuthRoutes);
router.use("/admin", adminAuthRoutes);

export default router;
