import { ENV } from "../config/env.js";
import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows Mobile Hotspot DNS SRV resolution issues
// dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async() => {
  try {
    // log the connection string (without secrets) for debugging
    console.log("connecting to database with URL", ENV.DB_URL);
    await mongoose.connect(ENV.DB_URL);
  } catch (e) {
    console.error("error while connecting to database", e);
    // rethrow so the caller knows startup failed
    throw e;
  }
};