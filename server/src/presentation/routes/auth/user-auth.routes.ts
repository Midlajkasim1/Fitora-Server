import { userControllers } from "@/infrastructure/di/user/user.controllers";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { Request, Response, Router } from "express";

const router = Router();

router.post("/register", asyncHandler((req: Request, res: Response) =>
  userControllers.authController.register(req, res))
);

router.post("/verify-otp", asyncHandler((req: Request, res: Response) =>
  userControllers.authController.verifyOtp(req, res))
);
router.post("/resend-otp", asyncHandler((req: Request, res: Response) => 
  userControllers.authController.resendOtp(req, res)
));
router.post("/login", asyncHandler((req: Request, res: Response) => 
  userControllers.authController.login(req, res))
);
router.post("/google", asyncHandler((req: Request, res: Response) =>
  userControllers.authController.googleLogin(req, res))
);

router.post("/forgot-password", asyncHandler((req: Request, res: Response) => 
  userControllers.authController.forgotPassword(req, res))
);
router.post("/verify-reset-otp", asyncHandler((req: Request, res: Response) => 

  userControllers.authController.verifyResetOtp(req, res))
);
router.post("/reset-password", asyncHandler((req: Request, res: Response) => 
  userControllers.authController.resetPassword(req, res))
);
router.get("/me", userMiddlewares.authMiddleware,userMiddlewares.blockGuard, asyncHandler((req:Request, res:Response) => 
  userControllers.authController.getMe(req, res))
);
router.post("/logout", userMiddlewares.authMiddleware,userMiddlewares.blockGuard, asyncHandler((req, res) => 
  userControllers.authController.logout(req, res))
);

router.post("/refresh-token",asyncHandler((req:Request,res:Response)=>
  userControllers.authController.refreshToken(req,res))
);
export default router;
