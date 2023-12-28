import { NextFunction, Request, Response } from "express";
import { verifyJWTToken } from "@/utils/token";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
  const token = authorization.split(" ")[1];
  // Decode JWT Token
  try {
    const user = await verifyJWTToken(token);
    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
};
