import { FronteggPermissions } from "../../permissions";
import { Request } from "express";

export type FronteggContextResolverRes = {
  tenantId: string;
  userId: string;
  permissions: FronteggPermissions[];
  userPermissions?: string[];
  authenticatedEntityId: string;
  authenticatedEntityType: string;
};

export type FronteggContextResolver = (
  req: Request
) => Promise<FronteggContextResolverRes> | FronteggContextResolverRes;
