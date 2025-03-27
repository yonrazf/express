import { Router, Request, Response } from "express";
import { SAML_PREHOOK_SECRET } from "..";
import jwt from "jsonwebtoken";
import { getVendorToken } from "../utils/getVendorToken";

const router = Router();

router.post("/prehooks/signup", async (req: Request, res: Response) => {
  res.status(200).send({ message: "asd" });
});

router.post("/prehooks/saml", async (req: Request, res: Response) => {
  console.log("Received prehook with request body:", req.body);
  try {
    const prehookSecret = SAML_PREHOOK_SECRET;
    const recievedSecret = req.headers["x-webhook-secret"];
    if (!recievedSecret || typeof recievedSecret != "string")
      throw new Error(
        "did not receive secret from prehook or wrong type: secret is " +
          typeof recievedSecret
      );

    const isVerified = jwt.verify(recievedSecret, prehookSecret);
  } catch (err) {
    res.status(400).send({
      verdict: "allow",
      error: {
        status: 400,
        message: "could not verify jwt " + err,
      },
    });
  }
  let groups: string[] = [];
  try {
    groups = req.body?.data?.samlMetadata?.samlAttributes?.groups || [];
  } catch (err) {
    console.error("Could not extract groups from SAML response:", err);
  }

  res.status(200).json({
    verdict: "allow",
    response: {
      user: {
        metadata: JSON.stringify({ groups }),
      },
    },
  });
});

router.post("/prehooks/signup", onEvent);

async function onEvent(eventData) {
  const token = await getVendorToken();
  const query = new URLSearchParams({
    email: eventData.data.user.email,
  }).toString();

  const userResponse = await fetch(
    `https://api.frontegg.com/identity/resources/users/v1/email?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const userData = await userResponse.json();

  const { id: userId } = userData;

  const activationTokenResp = await fetch(
    `https://api.frontegg.com/identity/resources/users/v1/${userId}/links/generate-activation-token`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const activationTokenData = await activationTokenResp.json();

  const activationToken = activationTokenData.token;

  const resp = await fetch(
    `https://api.frontegg.com/identity/resources/users/v1/activate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "frontegg-vendor-host": "auth.sabich.life",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId,
        token: activationToken,
      }),
    }
  );

  if (!resp.ok) throw new Error("error in sending email " + resp);
  const data = await resp.json();

  return {
    verdict: "allow",
    response: {
      status: 200,
    },
  };
}

export { router as PrehooksRouter };
