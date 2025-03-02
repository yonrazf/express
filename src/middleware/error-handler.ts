import { Request, Response, NextFunction } from "express";
// import { CustomError } from "../custom-error";

export interface ErrorResponse {
  message: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  const defaultError: ErrorResponse[] = [{ message: "Something went wrong" }];
  res.status(400).send(defaultError);
};
