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
export default router;