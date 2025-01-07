import { HttpClient } from "@frontegg/client";
import { authenticator } from "../auth/authenticator";
import { config } from "../config";
import { Request, Response } from "express";

const httpClient = new HttpClient(authenticator.authenticatorInstance, {
  baseURL: config.urls.BASE_URL,
});

export async function authenticateUser(req: Request, res: Response) {
  const response = await httpClient.get(config.urls.IDENTITY_URL + "/users/v3");

  console.log(response.data);

  res.send(response.data.items[0]);
}
