import { notificationControllers } from "@/infrastructure/di/common/notification.controller";
import { userControllers } from "@/infrastructure/di/user/user.controllers";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { upload } from "@/presentation/middleware/multer.middleware";
import { Request, Response, Router } from "express";

import { reportControllers } from "@/infrastructure/di/report/report.controllers";

const router = Router();

router.post("/reports", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
    reportControllers.reportController.createReport(req, res)
));

router.get("/profile",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>

    userControllers.userController.userProfile(req,res)
));
router.put("/profile",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userController.userProfileUpdate(req,res)
));
router.put("/profileImage",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,upload.single("profileImage"),asyncHandler((req:Request,res:Response)=>
    userControllers.userController.uploadProfileImage(req,res)
));
router.put("/change-password",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userController.ChangePassword(req,res)
));
router.get("/specializations",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSpecializationController.getActiveSpecializations(req,res)
));
router.get("/specializations/:id",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSpecializationController.getSpecializationDetails(req,res)
));
router.get("/specializations/:id/start",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSpecializationController.getStartSession(req,res)
));
router.get("/subscriptions",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.getUserSubscriptionPlan(req,res)
));
router.get("/active-user-plan",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.checkActiveSubcriptionStatus(req,res)
));


router.get("/subscriptions/:id",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.getPlanDetails(req,res)
));
router.post("/purchase",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.purchasePlan(req,res)
));
router.patch("/subscriptions/cancel",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.CancelSubscription(req,res)
));
router.get("/subscriptions-history",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.getPurchaseHistory(req,res)
));
router.post("/health-metrics",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userHealthMetricsController.saveMetrics(req,res)
));
router.get("/health-metrics/check",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userHealthMetricsController.checkHealthMetrics(req,res)
));
router.patch("/health-metrics/weekly-update",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userHealthMetricsController.updateWeeklyProgress(req,res)
));


router.get("/advertisement",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userAdvertisementController.getAdvertisement(req,res)
));
router.get("/booking/trainers",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSlotsController.getTrainer(req,res)
));

router.get("/slots",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSlotsController.getAvailableSlot(req,res)
));
router.post("/slots/:slotId/book",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSlotsController.userBookSlot(req,res)
));
router.post("/slots/:slotId/cancel",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSlotsController.cancelBooking(req,res)
));
router.get("/upcoming-session",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSlotsController.UpcomingSessionSlots(req,res)
));
router.get("/chat/partners",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userSlotsController.getChatPartners(req,res)
));
router.get("/chat/:otherUserId",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.chatController.getChatHistory(req,res)
));
router.post("/chat/send",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.chatController.sendMessage(req,res)
));
router.patch("/chat/:otherUserId/read",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.chatController.markAsRead(req,res)
));
router.get("/premium-dashboard",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userController.getUserPremiumDashboard(req,res)
));

//notify
router.get("/notifications",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    notificationControllers.notificationController.getMyNotifications(req,res)
));
router.patch("/notifications/:id/read",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    notificationControllers.notificationController.markAsRead(req,res)
));
router.patch("/notifications/mark-all-read",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    notificationControllers.notificationController.markAllAsRead(req,res)
));
router.delete("/notifications/clear-all",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    notificationControllers.notificationController.clearAllNotifcation(req,res)
));
router.post("/generate-workout",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.aiPlanController.generateWorkout(req,res)
));
router.post("/generate-diet",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.aiPlanController.generateDiet(req,res)
));
router.get("/workout-plan",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.aiPlanController.getWorkoutPlan(req,res)
));
router.get("/diet-plan",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.aiPlanController.getDietPlan(req,res)
));
export default router;