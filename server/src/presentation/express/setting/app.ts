import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression"; 
import routes from "@/presentation/routes";
import { errorHandler } from "@/presentation/middleware/error.middleware";
import { env } from "@/infrastructure/config/env.config";
import onboardingRouter from "@/presentation/routes/auth/onboarding.routes";
import helmet from "helmet";
const app = express();

app.use(helmet());
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH","PUT"], 
}));
app.use(cookieParser());
app.use(compression());
app.use(express.json());

app.use("/api", routes);
app.use(errorHandler);


export default app;
