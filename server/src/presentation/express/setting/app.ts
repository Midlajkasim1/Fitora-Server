import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression"; 
import routes from "@/presentation/routes";
import { errorHandler } from "@/presentation/middleware/error.middleware";
import { env } from "@/infrastructure/config/env.config";
import helmet from "helmet";
import { userControllers } from "@/infrastructure/di/user/user.controllers";
import { asyncHandler } from "@/presentation/middleware/asyncHandler";
const app = express();

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH","PUT"], 
}));
app.use(cookieParser());
app.use(compression());
app.post("/api/user/webhook",express.raw({type:"application/json"}),asyncHandler((req:Request,res:Response)=>
    userControllers.userSubscriptionController.handlewebhook(req,res)
));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api", routes);
app.use(errorHandler);


export default app;
