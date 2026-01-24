import { userControllers } from "@/infrastructure/di/user/user.controllers";
import { Request, Response, Router } from "express";

const router = Router();

router.post("/register", (req:Request, res:Response) =>
  userControllers.authController.register(req, res)
);

router.post("/verify-otp", (req:Request, res:Response) =>
  userControllers.authController.verifyOtp(req, res)
);
router.post("/resend-otp",(req:Request,res:Response)=>{
  userControllers.authController.resendOtp(req,res)
})
router.post("/login",(req:Request,res:Response)=>{
  userControllers.authController.login(req,res)
})
router.post("/google", (req:Request,res:Response) =>
  userControllers.authController.googleLogin(req, res)
);


export default router;


