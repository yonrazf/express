import express, { json, Request, Response } from "express";
import cors from "cors";
import { ProductsRouter } from "./routes/products";
import { UsersRouter } from "./routes/users";
import { SamlRouter } from "./routes/samlLogin";
import { MetadataRouter } from "./routes/overrides";
import { frontegg } from "./middleware";
import { FronteggContext, withAuthentication } from "@frontegg/client";
import { FronteggPermissions } from "./permissions";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error-handler";
import { PrehooksRouter } from "./routes/prehooks";
import { WebhooksRouter } from "./routes/webhooks";
import { authenticateUser } from "./controllers/users";

import { authenticator } from "./auth/authenticator";
dotenv.config();
const API_KEY = process.env.FE_API_KEY;
const CLIENT_ID = process.env.FE_CLIENT_ID;

const app = express();

app.use(errorHandler);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://app-kcj0djtbjuee.frontegg.com/oauth/account/login",
  "*",
]; // Add all allowed origins here

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true); // Allow request
      return;
    },
  })
);

app.use(json());
app.use(express.static("public"));
app.use("/frontegg", async () => {
  console.log("middleware");
});

app.use(ProductsRouter);
app.use(UsersRouter);
app.use(MetadataRouter);
app.use(PrehooksRouter);
app.use(SamlRouter);
app.use("/webhooks", WebhooksRouter);
app.use("/timeout", async (req, res) => {
  setTimeout(() => {
    res.send("timeout");
  }, 10000);
});

app.all("*", async (req: Request, res: Response) => {
  const err = new Error("Not found");

  res.status(404).send({ error: err });
});

export { app };
