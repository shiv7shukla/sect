import "dotenv/config";
import app from "./app.js";
import path from "path";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./lib/db.js";
const __dirname = path.resolve();
if (ENV.NODE_ENV === "production")
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => { console.log("Backend running on port", ENV.PORT); });
    }
    catch (error) {
        console.error("Eror starting the server", error);
    }
};
startServer();
//# sourceMappingURL=server.js.map