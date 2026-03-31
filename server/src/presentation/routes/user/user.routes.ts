import { userControllers } from "@/infrastructure/di/user/user.controllers";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { upload } from "@/presentation/middleware/multer.middleware";
import { Request, Response, Router } from "express";

const router = Router();

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
router.get("/premium-dashboard",userMiddlewares.authMiddleware,userMiddlewares.blockGuard,asyncHandler((req:Request,res:Response)=>
    userControllers.userController.getUserPremiumDashboard(req,res)
));
export default router;