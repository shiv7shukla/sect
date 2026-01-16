import type { Request, Response, NextFunction } from "express"

export const asyncHandler=(fn:(req:Request, res:Response, next:NextFunction)=>Promise<any>)=>
(req:Request, res:Response, next:NextFunction)=>{ //it takes a fn as a parameter and returns another function which is calling fn
  Promise.resolve(fn(req, res, next)).catch(err=>next(err)); //error caught goes from next to the global error handler
}