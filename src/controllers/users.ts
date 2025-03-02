import { HttpClient } from "@frontegg/client";
import { authenticator } from "../auth/authenticator";
import { config } from "../config";
import { Request, Response } from "express";
import { AxiosError } from "axios";

const httpClient = new HttpClient(authenticator.authenticatorInstance, {
  baseURL: config.urls.BASE_URL,
});

export async function authenticateUser(req: Request, res: Response) {
  const response = await httpClient.get(config.urls.IDENTITY_URL + "/users/v3");

  console.log(response.data);

  res.send(response.data.items[0]);
}

export async function createUser(req: Request, res: Response) {
  const { email, password, tenantId, roleIds } = req.body;

  if (!email || !password || !tenantId || !roleIds || roleIds.length === 0)
    return res.status(400).send("Missing fields");

  const httpClient = new HttpClient(authenticator.authenticatorInstance, {
    baseURL: "https://api.frontegg.com",
  });

  try {
    console.log("going to create user");
    await httpClient.post(
      "/identity/resources/vendor-only/users/v1",
      {
        email,
        password,
        tenantId,
        roleIds,
      },
      {
        // "frontegg-vendor-host": "auth.sabich.life",
      }
    );
  } catch (err: any) {
    if (err instanceof AxiosError)
      return res.status(err.status).send(err.message);
    return res.status(500).send(err);
  }

  return res.status(201).send({ email, password });
}
