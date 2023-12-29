import { IRegistrationDTO } from "@/dto/registration.dto";
import { IUser, User } from "@/models/user";

export const registerUser = async (
  payload: IRegistrationDTO
): Promise<IUser | null> => {
  return await User.create(payload);
};

export const findById = async (id: string): Promise<IUser> => {
  return await User.findById(id).select("+password");
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({
    email,
  });
};

export const findByEmailAndToken = async (
  email: string,
  token: string
): Promise<IUser | null> => {
  return await User.findOne({
    email,
    resetPasswordToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
};
