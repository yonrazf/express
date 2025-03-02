import httpProxy from "http-proxy";
import { FronteggAuthenticator } from "@frontegg/client";
import { fronteggRoutesHelper } from "./middleware.routes";
import { IFronteggOptions } from "./types";
import { callMiddleware, validatePermissions } from "./utils";
import { proxyRequest } from "../frontegg/proxy";
import { configProxyEventHandlers } from "../frontegg/proxy/proxy.event-handlers";
import { Response } from "express";

const proxy = httpProxy.createProxyServer({
  secure: false,
  changeOrigin: true,
  xfwd: true,
});
const target =
  process.env.FRONTEGG_API_GATEWAY_URL || "https://api.frontegg.com/";

export function frontegg(options: IFronteggOptions) {
  console.log("you got to my frontegg middleware");

  if (!options) {
    throw new Error("Missing options");
  }
  if (!options.clientId) {
    throw new Error("Missing client ID");
  }
  if (!options.apiKey) {
    throw new Error("Missing api key");
  }
  if (!options.contextResolver) {
    throw new Error("Missing context resolver");
  }

  const authenticator = new FronteggAuthenticator();
  let authInitedPromise = authenticator.init(options.clientId, options.apiKey);

  configProxyEventHandlers(proxy, target, { ...options, authenticator });

  return async (req: any, res: Response) => {
    try {
      await authInitedPromise;
    } catch (e) {
      console.log("Failed to authenticate via promise - ", e);
      authInitedPromise = authenticator.init(options.clientId, options.apiKey);
      throw e;
    }

    if (
      options.authMiddleware &&
      !(await fronteggRoutesHelper.isFronteggPublicRoute(req))
    ) {
      console.log("Will pass request through the auth middleware");
      try {
        await callMiddleware(req, res, options.authMiddleware);
        if (res.headersSent) {
          // response was already sent from the middleware, we have nothing left to do
          console.log("Headers were already sent from authMiddleware");
          return;
        }
      } catch (e) {
        console.log(`Failed to call middleware - `, e);
        if (res.headersSent) {
          // response was already sent from the middleware, we have nothing left to do
          console.log(
            "authMiddleware threw error, but headers were already sent"
          );
          return;
        }

        // @ts-ignore
        return res.status(401).send(e.message);
      }
    }

    console.log(`going to resolve context`);
    const context = await options.contextResolver(req);
    console.log(`context resolved - ${JSON.stringify(context)}`);

    if (req.method === "OPTIONS") {
      console.log("OPTIONS call to frontegg middleware - returning STATUS 204");
      res.status(204).send();
      return;
    }

    console.log(`going to validate permissions for - `, req.url);
    try {
      await validatePermissions(req, res, context);
    } catch (e) {
      console.log("Failed at permissions check - ", e);
      return res.status(403).send();
    }

    if (!req.frontegg) {
      req.frontegg = {};
    }
    req.frontegg.retryCount = 0;
    console.log(`going to proxy request`);

    return proxyRequest(req, res, target, proxy, { context, authenticator });
  };
}
