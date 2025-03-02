import { FronteggPermissions } from "../permissions";
import { IncomingMessage } from "http";
import { Request, Response } from "express";
import { AuthMiddleware } from "./types";
import { FronteggContextResolverRes } from "../frontegg/context";

export let FRONTEGG_CLIENT_ID: string;
export let FRONTEGG_API_KEY: string;

const Whitelist = ["/metadata"];

// @ts-ignore
export function getUrlWithoutQueryParams(req): string {
  return req.url.split("?").shift();
}

export function flattenPermissions(
  permissions: FronteggPermissions[]
): string[] {
  const output: string[] = [];

  for (const p of permissions) {
    // noinspection SuspiciousTypeOfGuard
    if (typeof p === "string") {
      output.push(p);
    } else if (Array.isArray(p)) {
      for (const item of p) {
        output.push(item);
      }
    } else {
      console.log("running keys on  - ", p);
      const keys = Object.keys(p);
      for (const key of keys) {
        // @ts-ignore
        output.push(...flattenPermissions([p[key]]));
      }
    }
  }

  return output;
}

export async function validatePermissions(
  req: Request,
  res: Response,
  context: FronteggContextResolverRes
) {
  const permissions: FronteggPermissions[] = context.permissions;

  if (!permissions) {
    console.log("No permissions were passed for frontegg middleware");
    throw new Error("No permissions were passed for frontegg middleware");
  }

  if (!permissions.length) {
    console.log("Permissions array is empty for frontegg middleware");
    throw new Error("Permissions array is empty for frontegg middleware");
  }

  // We allow OPTIONS
  if (req.method === "OPTIONS") {
    console.log("OPTIONS is allowed");
    return;
  }

  if (permissions.includes(FronteggPermissions.All)) {
    console.log("User is authorized for ALL actions in the system");
    return;
  }

  const url = getUrlWithoutQueryParams(req);

  for (const whiteListed of Whitelist) {
    if (url.startsWith(whiteListed)) {
      console.log(`URL ${url} is whitelisted`);
      return;
    }
  }

  const allowedOperations = flattenPermissions(permissions);
  console.log(`allowedOperations for this user - `, allowedOperations);

  for (const operation of allowedOperations) {
    if (operation === "*") {
      console.log(`All operations are allowed for this user`);
      return;
    }

    const allowedMethod = operation.split(" ")[0];
    const route = operation.split(" ")[1];

    if (allowedMethod === "*" && url.startsWith(route)) {
      console.log(`User is authorized for ALL route`);
      return;
    }

    if (url === route && req.method === allowedMethod) {
      console.log(`User is authorized for ${req.method} ${req.baseUrl}`);
      return;
    }
  }

  console.log(
    `No matching permission for ${req.method} ${url}. Permissions - ${allowedOperations}`
  );
  throw new Error(`No matching permission for ${req.method} ${url}`);
}

// @ts-ignore
export function rewriteCookieDomain(header, oldDomain, newDomain): unknown {
  if (Array.isArray(header)) {
    return header.map((headerElement) => {
      return rewriteCookieDomain(headerElement, oldDomain, newDomain);
    });
  }

  return header.replace(
    new RegExp(`(;\\s*domain=)${oldDomain};`, "i"),
    `$1${newDomain};`
  );
}

export function enableCors(req: Request, res: IncomingMessage) {
  if (req.headers["access-control-request-method"]) {
    console.log(`enableCors - going to set access-control-request-method`);
    res.headers["access-control-allow-methods"] =
      req.headers["access-control-request-method"];
  }

  if (req.headers["access-control-request-headers"]) {
    console.log(`enableCors - going to set access-control-request-headers`);
    res.headers["access-control-allow-headers"] =
      req.headers["access-control-request-headers"];
  }

  if (req.headers.origin) {
    console.log(
      `enableCors - going to set access-control-allow-origin to ${req.headers.origin}`
    );
    res.headers["access-control-allow-origin"] = req.headers.origin;
    res.headers["access-control-allow-credentials"] = "true";
  }
}

export async function callMiddleware(
  req: Request,
  res: Response,
  middleware: AuthMiddleware
): Promise<void> {
  const middlewareWrap: Promise<string> = new Promise(async (next, reject) => {
    try {
      await middleware(req, res, next);
    } catch (e) {
      reject(e);
    }

    /* eslint-disable-next-line */
    // @ts-ignore
    next();
  });
  const nextValue: string = await middlewareWrap;
  console.log(nextValue);
  if (nextValue) {
    throw new Error(nextValue);
  }
}

interface RetryOptions {
  numberOfTries: number;
  secondsDelayRange: {
    min: number;
    max: number;
  };
}

export const retry = async (
  func: () => Promise<unknown>,
  { numberOfTries, secondsDelayRange }: RetryOptions
): Promise<unknown> => {
  try {
    return await func();
  } catch (error) {
    console.log(`Failed, remaining tries: ${numberOfTries - 1}`);
    if (numberOfTries === 1) {
      throw error;
    }
    const delayTime =
      Math.floor(
        Math.random() * (secondsDelayRange.max - secondsDelayRange.min + 1)
      ) + secondsDelayRange.min;
    console.log(`trying again in ${delayTime} seconds`);
    await delay(delayTime * 1000);

    return retry(func, { numberOfTries: numberOfTries - 1, secondsDelayRange });
  }
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
