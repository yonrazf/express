import { ErrorResponse } from "./middleware/error-handler";

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
  }

  abstract serializeErrors(): ErrorResponse[];
}