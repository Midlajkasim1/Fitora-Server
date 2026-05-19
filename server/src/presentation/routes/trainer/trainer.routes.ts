import { trainerController } from "@/infrastructure/di/trainer/trainer.controller";
import { userControllers } from "@/infrastructure/di/user/user.controllers";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { videoControllers } from "@/infrastructure/di/video/video.di";
import { asyncHandler } from "@/presentation/middleware/async.handler";
import { upload } from "@/presentation/middleware/multer.middleware";
import { Request, Response, Router } from "express";

const router = Router();

router.post(
  "/slots",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.createSlot(req, res)
  )
);

router.patch(
  "/slots/:slotId",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.editSlot(req, res)
  )
);

router.delete(
  "/slots/:slotId",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.cancelSlot(req, res)
  )
);

router.get(
  "/slots/personal",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.getPersonalUsers(req, res)
  )
);

router.get(
  "/slots/group",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.getGroupUsers(req, res)
  )
);

router.get(
  "/clients/:clientId",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.getClientDetails(req, res)
  )
);

router.get(
  "/slots/upcoming",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerSlotController.getTrainerUpcomingSlots(req, res)
  )
);

router.get(
  "/dashboard",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerController.getTrainerDashboard(req, res)
  )
);

router.get(
  "/profile",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerController.getTrainerProfile(req, res)
  )
);

router.put(
  "/profile",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  upload.single("profileImg"),
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerController.TrainerProfileUpdate(req, res)
  )
);

router.patch(
  "/profile/password",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerController.ChangePassword(req, res)
  )
);

router.get(
  "/wallet",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerController.getTrainerWallet(req, res)
  )
);

router.post(
  "/wallet/payout",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    trainerController.trainerController.requestPayout(req, res)
  )
);

router.get(
  "/chat/partners",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    userControllers.userSlotsController.getChatPartners(req, res)
  )
);

router.get(
  "/chat/:partnerId",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    userControllers.chatController.getChatHistory(req, res)
  )
);

router.post(
  "/chat/:partnerId/message",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    userControllers.chatController.sendMessage(req, res)
  )
);

router.patch(
  "/chat/:partnerId/read",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req: Request, res: Response) =>
    userControllers.chatController.markAsRead(req, res)
  )
);

// ---- Video Sessions (Trainer) ----
router.get(
  "/sessions/:slotId/join-token",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req, res) => videoControllers.videoCallController.getJoinToken(req, res))
);

router.post(
  "/sessions/:slotId/start",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req, res) => videoControllers.videoCallController.startSession(req, res))
);

router.post(
  "/sessions/:slotId/end",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req, res) => videoControllers.videoCallController.endSession(req, res))
);

router.get(
  "/sessions/:slotId/access",
  userMiddlewares.authMiddleware,
  userMiddlewares.blockGuard,
  asyncHandler((req, res) => videoControllers.videoCallController.getAccessState(req, res))
);

export default router;