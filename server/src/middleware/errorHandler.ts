import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "@/utils/errorResponse";

export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
    errors: err.errors,
  });
};
