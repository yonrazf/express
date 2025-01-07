import express, { json, Request, Response } from "express";
import cors from "cors";
import { ProductsRouter } from "./routes/products";
import { UsersRouter } from "./routes/users";

const app = express();

app.use(cors());
app.use(json());

app.use(ProductsRouter);
app.use(UsersRouter);

app.all("*", async (req: Request, res: Response) => {
  const err = new Error("Not found");

  res.status(404).send({ error: err });
});

export { app };
