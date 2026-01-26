import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression"; 
import routes from "@/presentation/routes";
import { errorHandler } from "@/presentation/middleware/error.middleware";

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET", "POST", "DELETE"," PATCH"],
}));
app.use(cookieParser());
app.use(compression());
app.use(express.json());

app.use("/api", routes);
app.use(errorHandler);


export default app;
