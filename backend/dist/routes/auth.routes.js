import { Router } from "express";
export const authRouter = Router();
authRouter.get("/signup", (req, res) => {
    res.status(200).json({ msg: "signup endpoint" });
});
authRouter.get("/signin", (req, res) => {
    res.status(200).json({ msg: "signin endpoint" });
});
authRouter.get("/logout", (req, res) => {
    res.status(200).json({ msg: "logout endpoint" });
});
//# sourceMappingURL=auth.routes.js.map