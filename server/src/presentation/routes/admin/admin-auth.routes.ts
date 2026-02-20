import { Request, Response, Router } from "express";
import { adminControllers } from "@/infrastructure/di/admin/admin.controllers";
import { authenticate } from "@/presentation/middleware/auth.middleware";
import { upload } from "@/presentation/middleware/multer.middleware";
const router = Router();

router.post( "/login",(req: Request, res:Response) => adminControllers.adminAuthController.login(req, res)
);
router.post("/refresh-token", (req:Request, res:Response) => 
  adminControllers.adminAuthController.refreshToken(req, res)
);
router.get("/me", authenticate, (req:Request, res:Response) => 
  adminControllers.adminAuthController.getAdminMe(req, res)
);
router.get("/users", authenticate, (req:Request, res:Response) => 
  adminControllers.adminUserController.getUsers(req, res)
);

router.patch("/users/:id/block", authenticate, (req:Request, res:Response) => 
  adminControllers.adminUserController.blockUser(req, res)
);
router.get("/trainers", authenticate, (req:Request, res:Response) => 
  adminControllers.adminTrainerController.getAllTrainers(req, res)
);
router.patch("/trainers/:id/block", authenticate, (req:Request, res:Response) => 
  adminControllers.adminTrainerController.blockTrainer(req, res)
);
router.post("/logout", authenticate, (req:Request, res:Response) => 
  adminControllers.adminAuthController.logout(req, res)
);
router.post("/specializations",authenticate,upload.single("imageUrl"),(req:Request,res:Response)=>
  adminControllers.specializationController.createSpecialization(req,res)
);
router.put("/specializations/:id",authenticate,upload.single("imageUrl"),(req:Request,res:Response)=>
  adminControllers.specializationController.updateSpecialization(req,res)
);
router.get("/get-allUsers",authenticate,(req:Request,res:Response)=>
  adminControllers.adminAuthController.getAllUSerCount(req,res)
);

export default router;
