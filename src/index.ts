import dotenv from "dotenv";
import { app } from "./app";
import { FronteggContext } from "@frontegg/client";
import { FronteggAuthenticator } from "@frontegg/client";
import { authenticator } from "./auth/authenticator";
import { IAccessTokensOptions } from "@frontegg/client/dist/src/components/frontegg-context/types";

dotenv.config();
export const API_KEY = process.env.FE_API_KEY;
export const CLIENT_ID = process.env.FE_CLIENT_ID;
export const FE_BASE_URL = process.env.FE_BASE_URL;
export const SAML_PREHOOK_SECRET = process.env.FE_SAML_PREHOOK_SECRET;
const PORT = process.env.PORT || 4000;

const appConfig = {
  API_KEY,
  CLIENT_ID,
  FE_BASE_URL,
  SAML_PREHOOK_SECRET,
  PORT,
};

Object.keys(appConfig).forEach((key) => {
  if (!appConfig[key])
    throw new Error(`Environment variable ${key} is undefined`);
});

FronteggContext.init({
  FRONTEGG_CLIENT_ID: process.env.FE_CLIENT_ID,
  FRONTEGG_API_KEY: process.env.FE_API_KEY,
});

const startup = async () => {
  await authenticator.authenticatorInstance.init(CLIENT_ID, API_KEY);

  app.listen(PORT, () => {
    console.log("listening on " + PORT);
  });
};

startup();
