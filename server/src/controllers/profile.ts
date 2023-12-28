import { NextFunction, Request, Response } from "express";
import { userResource } from "@/resources/userResource";
import { ErrorResponse } from "@/utils/errorResponse";
import { existsSync, unlinkSync } from "fs";
import { paths } from "@paths";
import { join } from "path";

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  try {
    let user = req.user;
    if (user) {
      user.name = name;
      if (req.file) {
        const file = req.file;
        // Delete old file if any
        if (user.avatar) {
          const avatar = join(paths.publicStorageDir, user.avatar);
          if (existsSync(avatar)) {
            unlinkSync(avatar);
          }
        }
        const index = file.path.indexOf("users");
        user.avatar = file.path.slice(index, file.path.length);
      }
      user = await user.save();
      return res.json({
        statusCode: 200,
        message: "Profile updated successfully",
        data: {
          user: userResource(user),
        },
      });
    }
  } catch (err: any) {
    return next(new ErrorResponse(err.message, 500));
  }
};
