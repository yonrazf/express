import { FronteggAuthenticator } from "@frontegg/client";
import { NextFunction, Response } from "express";
import { memoize, once } from "lodash";

const getAuthenticator = once(() => new FronteggAuthenticator());

const initAuthenticator = memoize(() => {
  const authenticator = getAuthenticator();

  return authenticator.init("[client-id]", "[app-id]");
});
