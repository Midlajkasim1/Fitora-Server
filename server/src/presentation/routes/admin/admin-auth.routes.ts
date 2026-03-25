import { adminControllers } from "@/infrastructure/di/admin/admin.controllers";
import { adminMiddlewares } from "@/infrastructure/di/admin/admin.middleware";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
import { upload } from "@/presentation/middleware/multer.middleware";
import { Request, Response, Router } from "express";
const router = Router();

router.post( "/login",asyncHandler((req: Request, res:Response) => adminControllers.adminAuthController.login(req, res))
);
router.post("/refresh-token", asyncHandler((req:Request, res:Response) => 
  adminControllers.adminAuthController.refreshToken(req, res))
);
router.get("/me", adminMiddlewares.authMiddleware, asyncHandler((req:Request, res:Response) => 
  adminControllers.adminAuthController.getAdminMe(req, res))
);
router.get("/users", adminMiddlewares.authMiddleware, asyncHandler((req:Request, res:Response) => 
  adminControllers.adminUserController.getUsers(req, res))
);

router.patch("/users/:id/block", adminMiddlewares.authMiddleware, asyncHandler((req:Request, res:Response) => 
  adminControllers.adminUserController.blockUser(req, res))
);
router.get("/trainers", adminMiddlewares.authMiddleware, asyncHandler((req:Request, res:Response) => 
  adminControllers.adminTrainerController.getAllTrainers(req, res))
);
router.patch("/trainers/:id/block", adminMiddlewares.authMiddleware, asyncHandler((req:Request, res:Response) => 
  adminControllers.adminTrainerController.blockTrainer(req, res))
);
router.post("/logout", adminMiddlewares.authMiddleware, asyncHandler((req:Request, res:Response) => 
  adminControllers.adminAuthController.logout(req, res))
);
router.post("/create-specializations",adminMiddlewares.authMiddleware,upload.single("image"),asyncHandler((req:Request,res:Response)=>
  adminControllers.specializationController.createSpecialization(req,res))
);
router.put("/edit-specializations/:id",adminMiddlewares.authMiddleware,upload.single("image"),asyncHandler((req:Request,res:Response)=>
  adminControllers.specializationController.updateSpecialization(req,res))
);
router.get("/specializations",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.specializationController.getAllSpecialization(req,res)
));
router.patch("/specializations/:specializationId/block",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.specializationController.BlockSpecialization(req,res)
));
router.get("/specializations/:id",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.specializationController.GetSingleSpecialization(req,res)
));
router.get("/trainer/verifications",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.adminTrainerController.getTrainerVerifications(req,res)
));
router.get("/trainer/verifications/:id",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.adminTrainerController.getSingleTrainerVerification(req,res)
));
router.patch("/trainer/verifications/:id",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.adminTrainerController.updateTrainerApprovalStatus(req,res)
));
router.get("/trainer/verifications/:id",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.adminTrainerController.getSingleTrainerVerification(req,res)
));
router.post("/workouts",adminMiddlewares.authMiddleware,upload.fields([
  {name:"video",maxCount:1},
  {name:"thumbnail",maxCount:1}
]),asyncHandler((req:Request,res:Response)=>
  adminControllers.workoutController.createWorkout(req,res)
));
router.get("/workouts",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.workoutController.getAllWorkout(req,res)
));
router.get("/workouts/:id",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.workoutController.getWorkoutById(req,res)
));
router.put("/workouts/:id",adminMiddlewares.authMiddleware,upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]),asyncHandler((req:Request,res:Response)=>
  adminControllers.workoutController.updateWorkout(req,res)
));

router.patch("/workouts/:id/status",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.workoutController.updateWorkoutStatus(req,res)
));

router.post("/subscriptions",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
 adminControllers.subscriptionController.createSubscripionPlan(req,res)
));
router.get("/subscriptions",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
 adminControllers.subscriptionController.getSubscriptionPlan(req,res)
));
router.put("/subscriptions/:id",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
 adminControllers.subscriptionController.updateSubscriptionPlan(req,res)
));
router.patch("/subscriptions/:id/status",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
 adminControllers.subscriptionController.updateSubscriptionPlanStatus(req,res)
));
router.get("/subscriptions/:id",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
 adminControllers.subscriptionController.getSubscriptionPlanById(req,res)
));
router.post("/create-ad",adminMiddlewares.authMiddleware,upload.array("bannerImages",5),asyncHandler((req:Request,res:Response)=>
  adminControllers.advertisementController.createAdvertisement(req,res)
));
router.put("/update-ad/:id",adminMiddlewares.authMiddleware,upload.array("bannerImages",5),asyncHandler((req:Request,res:Response)=>
  adminControllers.advertisementController.updateAdvertisement(req,res)
));
router.get("/advertisement",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.advertisementController.getAllAdvertisement(req,res)
));
router.patch("/advertisement/:adId/status",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.advertisementController.updateStatusAdvertisement(req,res)
));
router.get("/advertisement/:id",adminMiddlewares.authMiddleware,asyncHandler((req:Request,res:Response)=>
  adminControllers.advertisementController.getAdvertisementById(req,res)
));

export default router;
