import { NextFunction, Request, Response } from "express";
import { FronteggContextResolver } from "../frontegg/context";

export interface IFronteggOptions {
  clientId: string;
  apiKey: string;
  contextResolver: FronteggContextResolver;
  authMiddleware?: AuthMiddleware;
  disableCors?: boolean;
  cookieDomainRewrite?: string;
  // default: 3
  maxRetries?: number;
}

export type AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;
