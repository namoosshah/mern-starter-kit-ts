import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { IUser } from "@/models/user";
import { ErrorResponse } from "@/utils/errorResponse";
import { generateJWTToken } from "@/utils/token";
import { sendMail } from "@/utils/mail";
import { readFileSync } from "fs";
import { paths } from "@paths";
import { join } from "path";
import { userResource } from "@/resources/userResource";
import {
  findByEmail,
  findByEmailAndToken,
  registerUser,
} from "@/services/user";

/* Register */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: IUser | null = await registerUser(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Account registered successfully",
      data: {
        user: userResource(user),
      },
    });
  } catch (err: any) {
    return next(new ErrorResponse(err.message, 500));
  }
};

/* Logging in */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user: IUser | null = await findByEmail(email);

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    const token = await generateJWTToken(user);
    res.json({
      statusCode: 200,
      data: {
        user: userResource(user),
        token,
      },
    });
  } catch (err: any) {
    return next(new ErrorResponse(err.message, 500));
  }
};

/* Send password reset link */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    let user = await findByEmail(email);
    if (user == null) {
      return res.status(400).json({
        statusCode: 400,
        message: "No account associated to given email",
      });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000);
    user = await user.save();
    // Send reset link via mail
    let from = process.env.MAIL_FROM_EMAIL || "admin@example.com";
    const fromName = process.env.MAIL_FROM_USER || "No Reply";
    from = `${fromName} <${from}>`;
    const appURL = process.env.APP_URL || "http://127.0.0.1:8000";
    const appName = process.env.APP_NAME || "";
    let html = readFileSync(
      join(paths.baseDir, "templates/mails/forgot-password.html"),
      "utf-8"
    );
    html = html
      .replace("{{username}}", user.name)
      .replace(new RegExp("{{appName}}", "g"), appName)
      .replace(
        "{{resetPasswordLink}}",
        `${appURL}/reset-password/${resetPasswordToken}?email=${user.email}`
      );

    sendMail(from, user.email, "Reset Password", html);

    return res.json({
      statusCode: 200,
      message:
        "Password reset link has been send successfully to your provided email",
    });
  } catch (err: any) {
    return next(new ErrorResponse(err.message, 500));
  }
};

/* Reset password */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, token, password } = req.body;
  try {
    let user = await findByEmailAndToken(email, token);
    if (user == null) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Password reset link has expired, Please try again with a new link",
      });
    }
    user.password = password;
    user.resetPasswordToken = "";
    await user.save();

    return res.json({
      statusCode: 200,
      message: "Password updated successfully",
    });
  } catch (err: any) {
    return next(new ErrorResponse(err.message, 500));
  }
};
