import { Router } from "express";
import { adminControllers } from "@/infrastructure/di/admin/admin.controllers";
import { adminMiddlewares } from "@/infrastructure/di/admin/admin.middleware";

const router = Router();

router.get(
    "/overview",
    adminMiddlewares.authMiddleware,
    (req, res) => adminControllers.adminFinanceController.getOverview(req, res)
);

router.get(
    "/dashboard-stats",
    adminMiddlewares.authMiddleware,
    (req, res) => adminControllers.adminFinanceController.getDashboardStats(req, res)
);

router.get(
    "/transactions",
    adminMiddlewares.authMiddleware,
    (req, res) => adminControllers.adminFinanceController.getTransactions(req, res)
);

router.get(
    "/report",
    adminMiddlewares.authMiddleware,
    (req, res) => adminControllers.adminFinanceController.generateReport(req, res)
);

router.patch(
    "/payout/:id",
    adminMiddlewares.authMiddleware,
    (req, res) => adminControllers.adminFinanceController.handlePayout(req, res)
);

export default router;
