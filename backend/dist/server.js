import "dotenv/config";
import { server } from "./lib/socket.js";
import app from "./app.js";
import path from "path";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./lib/db.js";
import mongoose from "mongoose";
const __dirname = path.resolve();
if (ENV.NODE_ENV === "production")
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));
const PORT = ENV.PORT || 3000;
const startServer = async () => {
    try {
        await connectDB();
        console.log("Mongo connected to:", mongoose.connection.name);
        server.listen(PORT, () => { console.log("Backend running on port", ENV.PORT); });
    }
    catch (error) {
        console.error("Error starting the server", error);
    }
};
startServer();
//# sourceMappingURL=server.js.map