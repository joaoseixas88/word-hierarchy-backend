import { ZodIssue } from "zod";

export class ValidationException extends Error {
  statusCode: number;
  issues: ZodIssue[];
  constructor(issues: ZodIssue[], statusCode: number = 400) {
    super();
    this.statusCode = statusCode;
		this.issues = issues
		this.name = 'ValidationException'
  }
}
