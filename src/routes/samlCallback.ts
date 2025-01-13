import { Request, Response, Router } from "express";
import cors from "cors";
import { FE_BASE_URL, FE_TENANT_JWT } from "..";

const router = Router();

const body = JSON.stringify({
  relayState: "",
  samlResponse: "",
});
async function callSamlCallback(req: Request, res: Response) {
  try {
    const response = await fetch(`${FE_BASE_URL}/auth/saml/callback`, {
      headers: {
        Authorization: `Bearer ${FE_TENANT_JWT}`,
      },
      method: "POST",
      body,
    });
    console.log(response);
    res.send(response);
  } catch (err) {
    console.log(err);
  }
}

router.get("/samlCallback", callSamlCallback);
export { router as SamlRouter };
