import { IUser } from "@/models/user";

/* Format user to remove sensitive data */
export const userResource = (user: IUser | null) => {
  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
    };
  }
  return user;
};
