import { authRouter } from "./routes/auth.routes.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { conversationRouter } from "./routes/conversation.routes.js";
import { errorHandler } from "./utils/errorHandler.js";
import { app } from "./lib/socket.js";
const corsOptions = {
    origin: "https://sect-chat.netlify.app",
    credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.options("*", cors(corsOptions));
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map