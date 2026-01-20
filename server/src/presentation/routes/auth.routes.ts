import { Router,Request,Response} from "express";
import { controllers } from "@/infrastructure/di/controllers";

const router = Router();

router.post("/auth/register", (req:Request, res:Response) =>
  controllers.authController.register(req, res)
);

router.post("/auth/verify-otp", (req:Request, res:Response) =>
  controllers.authController.verifyOtp(req, res)
);
router.post('/auth/login',(req:Request,res:Response)=>{
  controllers.authController.login(req,res)
})

export default router;
