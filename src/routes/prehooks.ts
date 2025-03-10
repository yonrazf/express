import { Router, Request, Response } from "express";

const router = Router();

router.post("/prehooks/signup", async (req: Request, res: Response) => {
  res.status(200).send({ message: "asd" });
});

router.post("/prehooks/saml", async (req: Request, res: Response) => {
  console.log("received prehook with request body");
  console.log(req.body);
  const { body: eventData } = req;
  let groups = [];
  try {
    groups = eventData.data.samlMetadata.samlAttributes.groups;
  } catch (err) {
    console.log(`could not get groups from saml response: ${err}`);
  }
  res.status(200).send({
    verdict: "allow",
    response: {
      user: {
        metadata: JSON.stringify({
          groups: eventData.data.samlMetadata.samlAttributes.groups,
        }),
      },
    },
  });
});

export { router as PrehooksRouter };
