import { ObjectSchema, object, string } from "yup";

interface ILoginDTO {
  email: string;
  password: string;
}

export const loginDTO: ObjectSchema<ILoginDTO> = object({
  email: string().required("Email is required").email("Email is not valid"),
  password: string().required("Password is required"),
});
