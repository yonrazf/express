import { Router, Request, Response } from "express";

const router = Router();

router.post("/prehooks/signup", async (req: Request, res: Response) => {
  res.status(200).send({ message: "asd" });
});

router.post("/prehooks/saml", async (req: Request, res: Response) => {
  console.log("received prehook with request body");
  console.log(req.body);
  const { body: eventData } = req;
  res.status(200).send({
    verdict: "allow",
    response: {
      user: {
        metadata: JSON.stringify({
          department: eventData.data.samlMetadata.samlAttributes.department[0],
          title: eventData.data.samlMetadata.samlAttributes.title[0],
        }),
      },
    },
  });
});

export { router as PrehooksRouter };
