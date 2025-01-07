import { Router, Request, Response } from "express";
import { withAuthentication } from "@frontegg/client";

const router = Router();

router.get(
  "/api/products",
  withAuthentication(),
  async (req: Request, res: Response) => {
    console.log("hi");
    res.status(200).send([
      { name: "shirt", price: 50 },
      { name: "pants", price: 150 },
    ]);
  }
);

router.get("/protected", async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);

  res.status(204).send();
});

export { router as ProductsRouter };
