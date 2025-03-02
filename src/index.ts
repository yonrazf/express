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
const PORT = process.env.PORT || 4000;

const appConfig = {
  API_KEY,
  CLIENT_ID,
  FE_BASE_URL,
  PORT,
};

Object.keys(appConfig).forEach((key) => {
  if (!appConfig[key])
    throw new Error(`Environment variable ${key} is undefined`);
});

const accessTokensOptions: IAccessTokensOptions = {
  cache: {
    type: "redis",
    options: {
      url: "redis[s]://[[username][:password]@]172.17.0.2:6379",
    },
  },
};

FronteggContext.init(
  {
    FRONTEGG_CLIENT_ID: process.env.FE_CLIENT_ID,
    FRONTEGG_API_KEY: process.env.FE_API_KEY,
  },
  {
    accessTokensOptions,
  }
);

const startup = async () => {
  await authenticator.init();

  app.listen(PORT, () => {
    console.log("listening on " + PORT);
  });
};

startup();
