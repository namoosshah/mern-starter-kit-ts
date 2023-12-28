import { AnySchema, ValidationError } from "yup";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "@/utils/errorResponse";

export const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      return next();
    } catch (errors: any) {
      let messages: any = {};
      errors.inner.map((e: ValidationError) => {
        messages[e.path || e.name] = e.errors[0];
      });
      return next(new ErrorResponse("Unprocessable Entity", 422, messages));
    }
  };
