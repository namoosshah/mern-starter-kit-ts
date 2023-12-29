import { Schema, Document, model, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { findByEmail } from "@/services/user";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetTokenExpiry?: Date | null;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please use a valid address"],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Please use minimum of 8 characters"],
    },
    resetPasswordToken: String,
    resetTokenExpiry: Date,
    avatar: String,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hashSync(this.password, salt);
  this.password = password;
  next();
});

export const User: Model<IUser> = model<IUser>("User", userSchema);

/* Check if user email already exists */
export const isUniqueUser = async (email: string) => {
  const user = await findByEmail(email);
  return !user;
};
