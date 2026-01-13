import { authRouter } from "./routes/auth.routes.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);

export default app;