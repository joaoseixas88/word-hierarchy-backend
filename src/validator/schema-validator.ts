import { Schema } from "zod";
import { ValidationException } from "../presentation/errors/validation";

export class SchemaValidator {
  static validateSchema<T = any>(
    schema: Schema<T>,
    params: any,
    statusCode?: number
  ) {
    try {
      return schema.parse(params);
    } catch (error: any) {
      throw new ValidationException(error.issues, statusCode);
    }
  }
}
