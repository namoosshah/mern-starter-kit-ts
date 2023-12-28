import { ObjectSchema, object, string } from "yup";

interface IProfile {
  name: string;
}

export const profileDTO: ObjectSchema<IProfile> = object({
  name: string()
    .required("Name is required")
    .min(3, "Name should be at least 3 characters long"),
});
