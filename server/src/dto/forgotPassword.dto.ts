import { ObjectSchema, object, string } from "yup";

interface IForgotPasswordDTO {
  email: string;
}

export const forgotPasswordDTO: ObjectSchema<IForgotPasswordDTO> = object({
  email: string().required("Email is required").email("Email is not valid"),
});
