import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
export const generateToken = (id, res) => {
    const token = jwt.sign({ id: id.toString() }, ENV.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //the age for cookie's lifetime must be in ms
        httpOnly: true,
        sameSite: "none",
        secure: ENV.NODE_ENV === "production",
    });
    return token;
};
//# sourceMappingURL=generateToken.js.map