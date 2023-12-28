import { ObjectSchema, object, string } from "yup";
import { isUniqueUser } from "@/models/user";
import { isPasswordValid } from "@/utils/passwordValidator";

interface IRegistrationDTO {
  name: string;
  email: string;
  password: string;
}

export const registrationDTO: ObjectSchema<IRegistrationDTO> = object({
  name: string()
    .required("Name is required")
    .min(3, "Name should be at least 3 characters long"),
  email: string()
    .required("Email is required")
    .email("Email is not valid")
    .test("unique", "Email already taken!", isUniqueUser),
  password: string()
    .required("Password is required")
    .test(
      "validatePassword",
      "The password must be 8 to 20 characters long and include at least one number, one special character, one uppercase letter, and one lowercase letter.",
      isPasswordValid
    ),
});
