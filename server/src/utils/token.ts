import jwt from "jsonwebtoken";
import { IUser } from "@/models/user";
import { findById } from "@/services/user";

export type JWTToken = {
  id: string;
  iat: number;
  exp: number;
};

// Generate token
export const generateJWTToken = async (user: IUser) => {
  const secret = process.env.JWT_SECRET || "";
  return await jwt.sign(
    {
      id: user._id,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRY || "7d",
    }
  );
};

export const verifyJWTToken = async (token: string): Promise<IUser | null> => {
  const secret = process.env.JWT_SECRET || "";
  try {
    const decoded = await jwt.verify(token, secret);
    return await findById((decoded as JWTToken).id);
  } catch (err) {}
  return null;
};
