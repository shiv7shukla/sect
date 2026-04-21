import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { User } from "../models/userModel.js";
export const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token)
        return res.status(401).json({ "message": "Unauthorized - token not provided" });
    try {
        const decode = jwt.verify(token, ENV.JWT_SECRET);
        if (!decode)
            return res.status(401).json({ "message": "Unauthorized - invalid token" });
        const user = await User.findById(decode.id).select("-password");
        if (!user)
            return res.status(401).json({ "message": "Invalid token" });
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError)
            return res.status(401).json({ "message": "Unauthorized - invalid token" });
        return res.status(500).json({ "message": "Internal server error" });
    }
};
//# sourceMappingURL=protectRoute.middleware.js.map