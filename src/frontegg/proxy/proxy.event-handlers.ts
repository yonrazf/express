import { proxyRequest } from "./index";
import { ServerResponse } from "http";
import Server from "http-proxy";
import { enableCors, rewriteCookieDomain } from "../../middleware/utils";
import { FronteggAuthenticator } from "@frontegg/client";
import { IFronteggOptions } from "../../middleware";

interface ConfigProxyEventHandlersOptions extends IFronteggOptions {
  authenticator: FronteggAuthenticator;
}

export const configProxyEventHandlers = (
  proxy: Server,
  target: string,
  options: ConfigProxyEventHandlersOptions
) => {
  proxy.on("error", async (err, req: any, res) => {
    console.error(`Failed proxying request to ${req.url} - `, err);
    req.frontegg.retryCount++;
    console.log(`retry count of ${req.url} - `, req.frontegg.retryCount);

    const { maxRetries = 3, authenticator, contextResolver } = options;
    if (
      req.frontegg.retryCount >= maxRetries &&
      res instanceof ServerResponse
    ) {
      return res.writeHead(500).end("Frontegg request failed");
    }

    // Get the context again
    const context = await contextResolver(req);

    return proxyRequest(req, res, target, proxy, { context, authenticator });
  });

  proxy.on("proxyRes", (proxyRes, req: any) => {
    console.log(`proxyRes - returned for ${req.originalUrl}`);

    if (!options.disableCors) {
      enableCors(req, proxyRes);
    } else {
      delete proxyRes.headers["access-control-allow-methods"];
      delete proxyRes.headers["access-control-allow-headers"];
      delete proxyRes.headers["access-control-allow-origin"];
      delete proxyRes.headers["access-control-allow-credentials"];
    }

    if (options.cookieDomainRewrite) {
      const host = req.headers.host;

      Object.keys(proxyRes.headers).forEach((key) => {
        if (key.toLowerCase() === "set-cookie") {
          // @ts-ignore
          proxyRes.headers["set-cookie"] = rewriteCookieDomain(
            proxyRes.headers[key],
            host,
            <string>options.cookieDomainRewrite
          );
        }
      });
    }
  });

  proxy.on("proxyReq", (proxyReq, req: any) => {
    try {
      if (req.hostname) {
        proxyReq.setHeader("frontegg-vendor-host", req.hostname);
      }

      // We are removing the authorization header as this is not used when proxying
      proxyReq.removeHeader("authorization");
      proxyReq.removeHeader("Authorization");

      if (req.body) {
        let contentType = proxyReq.getHeader("Content-Type") as string;
        let contentLength = proxyReq.getHeader("Content-Length") as number;
        if (contentType && contentType.startsWith("multipart/form-data")) {
          proxyReq.setHeader("Content-Type", contentType);
          proxyReq.setHeader("Content-Length", contentLength);
          return;
        }
        const bodyData = Buffer.isBuffer(req.body)
          ? req.body
          : JSON.stringify(req.body);
        contentType = "application/json";
        contentLength = Buffer.byteLength(bodyData);
        proxyReq.write(bodyData);
      }
    } catch (e) {
      console.error("could not proxy request to frontegg", e);
    }
  });
};
