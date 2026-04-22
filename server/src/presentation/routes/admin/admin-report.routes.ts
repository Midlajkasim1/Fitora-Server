import { Router, Request, Response } from "express";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { adminControllers } from "@/infrastructure/di/admin/admin.controllers";
import { adminMiddlewares } from "@/infrastructure/di/admin/admin.middleware";

const router = Router();

router.get("/", adminMiddlewares.authMiddleware, asyncHandler((req: Request, res: Response) => 
  adminControllers.adminReportController.getReports(req, res))
);

router.get("/summary", adminMiddlewares.authMiddleware, asyncHandler((req: Request, res: Response) => 
  adminControllers.adminReportController.getSummary(req, res))
);

router.get("/:id", adminMiddlewares.authMiddleware, asyncHandler((req: Request, res: Response) => 
  adminControllers.adminReportController.getReportById(req, res))
);

router.patch("/:id/status", adminMiddlewares.authMiddleware, asyncHandler((req: Request, res: Response) => 
  adminControllers.adminReportController.updateStatus(req, res))
);

export default router;
