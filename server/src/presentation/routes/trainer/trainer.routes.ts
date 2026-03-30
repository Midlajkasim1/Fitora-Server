import { trainerController } from "@/infrastructure/di/trainer/trainer.controller";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { Request, Response, Router } from "express";



const router = Router();

router.post("/create-slots",userMiddlewares.authMiddleware,asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.createSlot(req, res)
  ));
  router.put("/edit-slots/:slotId",userMiddlewares.authMiddleware,asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.editSlot(req, res)
  ));
router.delete("/:slotId/cancel",userMiddlewares.authMiddleware,asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.cancelSlot(req, res)
  ));
  router.get("/personal",userMiddlewares.authMiddleware,asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.getPersonalUsers(req, res)
  ));
   router.get("/group",userMiddlewares.authMiddleware,asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.getGroupUsers(req, res)
  ));
   router.get("/upcoming-slots",userMiddlewares.authMiddleware,asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.getTrainerUpcomingSlots(req, res)
  ));
  router.get("/dashboard",userMiddlewares.authMiddleware,asyncHandler((req: Request, res: Response) =>
    trainerController.trainerController.getTrainerDashboard(req, res)
  ));
  

export default router;