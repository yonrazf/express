import { HttpClient } from "@frontegg/client";
import { authenticator } from "../auth/authenticator";
import { config } from "../config";
import { Request, Response } from "express";
import { withAuthentication } from "@frontegg/client";
import { AxiosError } from "axios";
import { IdentityClient } from "@frontegg/client";
import { CLIENT_ID, API_KEY } from "..";
import { AuthHeaderType } from "@frontegg/client/dist/src/clients/identity/types";
import { JsonWebTokenError } from "jsonwebtoken";

const httpClient = new HttpClient(authenticator.authenticatorInstance, {
  baseURL: config.urls.BASE_URL,
});

export async function authenticateUser(req: Request, res: Response) {
  await authenticator.authenticatorInstance.validateAuthentication();
  console.log(authenticator.authenticatorInstance.accessToken);
  const response = await httpClient.get(
    config.urls.IDENTITY_URL + "/users/v3",
    {
      headers: {
        Authorization: `Bearer ${authenticator.authenticatorInstance.accessToken}`,
      },
    }
  );

  console.log(response.data[0]);

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
    console.log(authenticator.authenticatorInstance.accessToken);
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

export async function validateUser(req: Request, res: Response) {
  console.log("validating user");
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const identityClient = new IdentityClient({
      FRONTEGG_CLIENT_ID: CLIENT_ID,
      FRONTEGG_API_KEY: API_KEY,
    });

    const response = await identityClient.validateToken(
      token,
      {
        withRolesAndPermissions: true,
      },
      AuthHeaderType.AccessToken
    );
    console.log(response);

    res.send({ response });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(err.statusCode || 500).send({ error: err });
    }
  }
}
