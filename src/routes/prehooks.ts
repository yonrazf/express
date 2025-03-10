import { Router, Request, Response } from "express";
import { SAML_PREHOOK_SECRET } from "..";
import jwt from "jsonwebtoken";

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

export { router as PrehooksRouter };
