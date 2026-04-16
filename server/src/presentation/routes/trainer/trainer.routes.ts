import { trainerController } from "@/infrastructure/di/trainer/trainer.controller";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { upload } from "@/presentation/middleware/multer.middleware";
import { Request, Response, Router } from "express";



const router = Router();

router.post("/create-slots", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerSlotController.createSlot(req, res)
));
router.put("/edit-slots/:slotId", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerSlotController.editSlot(req, res)
));
router.delete("/:slotId/cancel", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerSlotController.cancelSlot(req, res)
));
router.get("/personal", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerSlotController.getPersonalUsers(req, res)
));
router.get("/group", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerSlotController.getGroupUsers(req, res)
));
router.get("/upcoming-slots", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerSlotController.getTrainerUpcomingSlots(req, res)
));
router.get("/dashboard", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerController.getTrainerDashboard(req, res)
));
router.get("/profile", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerController.getTrainerProfile(req, res)
));

router.put("/profileImage", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, upload.single("profileImg"), asyncHandler((req: Request, res: Response) =>
  trainerController.trainerController.uploadProfileImage(req, res)
));
router.put("/edit-profile", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, upload.single("profileImg"), asyncHandler((req: Request, res: Response) =>
  trainerController.trainerController.TrainerProfileUpdate(req, res)
));
router.put("/change-password", userMiddlewares.authMiddleware, userMiddlewares.blockGuard, asyncHandler((req: Request, res: Response) =>
  trainerController.trainerController.ChangePassword(req, res)
));

export default router;