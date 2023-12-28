import { IUser } from "@/models/user";

/* Format user to remove sensitive data */
export const userResource = (user: IUser) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
