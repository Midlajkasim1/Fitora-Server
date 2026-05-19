import { adminControllers } from "@/infrastructure/di/admin/admin.controllers";
import { adminMiddlewares } from "@/infrastructure/di/admin/admin.middleware";
import { asyncHandler } from "@/presentation/middleware/async.handler";
import { Request, Response, Router } from "express";

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
