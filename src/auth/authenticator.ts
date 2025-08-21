import { FronteggAuthenticator } from "@frontegg/client";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.FE_API_KEY;
const clientId = process.env.FE_CLIENT_ID;

export class AuthenticatorWrapper {
  public authenticatorInstance: FronteggAuthenticator;
  constructor() {
    this.authenticatorInstance = new FronteggAuthenticator();
  }

  // public async init() {
  //   await this.authenticatorInstance.init(clientId, apiKey);
  // }
}

const authenticator = new AuthenticatorWrapper();

authenticator.authenticatorInstance.init(clientId, apiKey);

export { authenticator };
