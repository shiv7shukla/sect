import type {Request, Response, NextFunction} from "express";

export const errorHandler=(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
)=>{
    if(res.headersSent) return next(err);
    const status=typeof err?.statusCode === "number" ? err.statusCode : 500;
    const message=status >= 500 ? "Internal Server Error" : (err?.message || "Error");
    console.error(err);
    res.status(status).json({ message });
};