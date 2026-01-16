import { Router } from "express";
import { controllers } from "@/infrastructure/di/controllers";

const router = Router();

router.post("/auth/register", (req, res) =>
  controllers.authController.register(req, res)
);

export default router;
