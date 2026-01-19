import { authRouter } from "./routes/auth.routes.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { conversationRouter } from "./routes/conversation.routes.js";
import { errorHandler } from "./utils/errorHandler.js";

const app=express();

app.use(cors({origin:"http://localhost:5173", credentials:true}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);
app.use(errorHandler);

export default app;