import { Router, Request, Response } from "express";

const router = Router();

router.post("/prehooks/signup", async (req: Request, res: Response) => {
  res.status(200).send({ message: "asd" });
});

router.post("/prehooks/saml", async (req: Request, res: Response) => {
  console.log("Received prehook with request body:", req.body);

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
