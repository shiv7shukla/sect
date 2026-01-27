import type {Request, Response, NextFunction} from "express";

export const errorHandler=(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
)=>{
    if(res.headersSent) return next(err);
    if(err.code === 11000){ // Handle MongoDB duplicate key error
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      const value = err.keyValue?.[field];
      return res.status(409).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists` 
      });
    }
    if(err.name === 'ValidationError'){ // Handle Mongoose validation errors
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    const status=typeof err?.statusCode === "number" ? err.statusCode : 500;
    const message=status >= 500 ? "Internal Server Error" : (err?.message || "Error");
    console.error(err);
    res.status(status).json({ message });
};