import { Router } from "express";
import { adminControllers } from "@/infrastructure/di/admin/admin.controllers";
const router = Router();

router.post(
  "/login",
  (req, res) => adminControllers.adminAuthController.login(req, res)
);

export default router;
