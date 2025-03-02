import Server from "http-proxy";
import { FronteggAuthenticator } from "@frontegg/client";
import { FronteggContextResolverRes } from "../context";
import { getPackageJson } from "../../utils/get-package-json";

const pjson = getPackageJson() || { version: "unknown" };

type ProxyRequestHeaders = Record<string, string>;

export interface ProxyRequestOptions {
  context: FronteggContextResolverRes;
  authenticator: FronteggAuthenticator;
}

export async function proxyRequest(
  req: any,
  res: any,
  target: string,
  proxy: Server,
  { context, authenticator }: ProxyRequestOptions
) {
  await authenticator.validateAuthentication();
  // @ts-ignore
  console.log(`going to proxy request - ${req.originalUrl} to ${target}`);

  const headers: ProxyRequestHeaders = {
    "x-access-token": authenticator.accessToken,
    "frontegg-tenant-id":
      context && context.tenantId ? context.tenantId : "WITHOUT_TENANT_ID",
    "frontegg-user-id": context && context.userId ? context.userId : "",
    "frontegg-vendor-host": req.hostname,
    "frontegg-middleware-client": `Node.js@${pjson.version}`,
    "frontegg-authenticated-entity-id": context.authenticatedEntityId,
    "frontegg-authenticated-entity-type": context.authenticatedEntityType,
  };

  if (context.userPermissions) {
    headers["frontegg-user-permissions"] = context.userPermissions.join(",");
  }

  proxy.web(req, res, {
    target,
    headers,
  });
}
