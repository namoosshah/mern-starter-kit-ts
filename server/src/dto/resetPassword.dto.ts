import { ObjectSchema, object, string } from "yup";
import { isPasswordValid } from "@/utils/passwordValidator";

interface IResetPasswordDTO {
  email: string;
  token: string;
  password: string;
}

export const resetPasswordDTO: ObjectSchema<IResetPasswordDTO> = object({
  email: string().required("Email is required").email("Email is not valid"),
  token: string().required("Token is missing"),
  password: string()
    .required("Password is required")
    .test(
      "validatePassword",
      "The password must be 8 to 20 characters long and include at least one number, one special character, one uppercase letter, and one lowercase letter.",
      isPasswordValid
    ),
});
