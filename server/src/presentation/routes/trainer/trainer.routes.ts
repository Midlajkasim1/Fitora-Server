import { trainerController } from "@/infrastructure/di/trainer/trainer.controller";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { Request, Response, Router } from "express";



const router = Router();

router.post("/create-slots",userMiddlewares.authMiddleware,asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.createSlot(req, res)
  )
);


export default router;