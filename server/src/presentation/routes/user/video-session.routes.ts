import { videoControllers } from "@/infrastructure/di/video/video.di";
import { userMiddlewares } from "@/infrastructure/di/user/user.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { Router } from "express";

const router = Router();

/**
 * @route GET /api/user/sessions/:slotId/join-token
 * @desc Get join token for a video session
 * @access Private
 */
router.get("/:slotId/join-token", 
    userMiddlewares.authMiddleware, 
    userMiddlewares.blockGuard, 
    asyncHandler((req, res) => videoControllers.videoCallController.getJoinToken(req, res))
);

/**
 * @route POST /api/user/sessions/:slotId/start
 * @desc Start a video session (Trainer only)
 * @access Private
 */
router.post("/:slotId/start", 
    userMiddlewares.authMiddleware, 
    userMiddlewares.blockGuard, 
    asyncHandler((req, res) => videoControllers.videoCallController.startSession(req, res))
);

/**
 * @route POST /api/user/sessions/:slotId/end
 * @desc End a video session (Trainer only)
 * @access Private
 */
router.post("/:slotId/end", 
    userMiddlewares.authMiddleware, 
    userMiddlewares.blockGuard, 
    asyncHandler((req, res) => videoControllers.videoCallController.endSession(req, res))
);

/**
 * @route GET /api/user/sessions/:slotId/access
 * @desc Get current UI state/access state for a session
 * @access Private
 */
router.get("/:slotId/access",
    userMiddlewares.authMiddleware,
    userMiddlewares.blockGuard,
    asyncHandler((req, res) => videoControllers.videoCallController.getAccessState(req, res))
);

export default router;

