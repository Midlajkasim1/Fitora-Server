import { userControllers } from "@/infrastructure/di/user/user.controllers";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { upload } from "@/presentation/middleware/multer.middleware";
import { Request, Response, Router } from "express";


const router = Router();

router.get("/profile",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
    userControllers.userController.userProfile(req,res)
));
router.put("/profile",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
    userControllers.userController.userProfileUpdate(req,res)
));
router.put("/profileImage",userMiddlewares.authMiddleware,upload.single("profileImage"),asyncHandler((req:Request,res:Response)=>
    userControllers.userController.uploadProfileImage(req,res)
));
router.put("/change-password",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
    userControllers.userController.ChangePassword(req,res)
));
router.get("/specializations",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
    userControllers.userSpecializationController.getActiveSpecializations(req,res)
));
router.get("/specializations/:id",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
    userControllers.userSpecializationController.getSpecializationDetails(req,res)
));
router.get("/specializations/:id/start",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
    userControllers.userSpecializationController.getStartSession(req,res)
));
router.get("/subscriptions",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.getUserSubscription(req,res)
));
router.get("/subscriptions/:id",userMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.getPlanDetails(req,res)
));

export default router;