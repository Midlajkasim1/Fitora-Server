import { Router, Request, Response } from "express";
import { reviewControllers } from "@/infrastructure/di/review/review.controllers";
import { authenticateUser } from "@/presentation/middleware/userAuth.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";

const router = Router();

router.post("/", authenticateUser(), asyncHandler((req: Request, res: Response) => 
  reviewControllers.reviewController.createReview(req, res)
));
router.post("/reports", authenticateUser(), asyncHandler((req: Request, res: Response) => 
  reviewControllers.reviewController.submitSessionReport(req, res)
));
router.get("/trainers/:id", asyncHandler((req: Request, res: Response) => 
  reviewControllers.reviewController.getTrainerReviews(req, res)
));

export default router;
