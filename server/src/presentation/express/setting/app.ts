import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression'; 

const app = express();

app.use(cors({
    origin:true,
    credentials:true,
    methods:['GET', 'POST', 'DELETE',' PATCH'],
}));
app.use(cookieParser());
app.use(compression());
app.use(express.json());



export default app;
