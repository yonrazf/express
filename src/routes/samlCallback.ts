import { Request, Response, Router } from "express";
import cors from "cors";

const router = Router();

const body = JSON.stringify({
  relayState: "",
  samlResponse: "",
});
async function callSamlCallback(req: Request, res: Response) {
  try {
    const response = await fetch(
      "https://app-kcj0djtbjuee.frontegg.com/auth/saml/callback",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImEwZmZmNjg2In0.eyJzdWIiOiIxNTY3YjEzOC0xNjgwLTQ3NDktOGZlYS1jYzViZDhjMmVjOGQiLCJ0ZW5hbnRJZCI6IjJlZWMyMjJjLWNmOWYtNDZjMi05MDc0LTVjYTdhOGNjYzZmOSIsInJvbGVzIjpbIkFkbWluIl0sInBlcm1pc3Npb25zIjpbImZlLmNvbm5lY3Rpdml0eS4qIiwiZmUuc2VjdXJlLioiLCJmZS5zdWJzY3JpcHRpb25zLioiLCJmZS5hY2NvdW50LXNldHRpbmdzLnJlYWQuYXBwIiwiZmUuc2VjdXJlLndyaXRlLmVuYWJsZURpc2FibGUiXSwibWV0YWRhdGEiOnt9LCJjcmVhdGVkQnlVc2VySWQiOiJjYjRlZTM0Ni05MzU5LTRhMGEtYTMwYy0xNmRiNWYwYjYwMDgiLCJ0eXBlIjoidGVuYW50QXBpVG9rZW4iLCJhcHBsaWNhdGlvbklkIjoiZWExNGE1NDQtOGIwNS00NGNjLWE5YTktZTIwYmNmYmYyNmU1IiwiYXVkIjoiYTBmZmY2ODYtNTljZC00NDk4LWE1ZGEtZWY3ZGVmMmExNjEzIiwiaXNzIjoiaHR0cHM6Ly9hcHAta2NqMGRqdGJqdWVlLmZyb250ZWdnLmNvbSIsImlhdCI6MTczNjc2MDM3NSwiZXhwIjoxNzM2ODQ2Nzc1fQ.iyBU4bezgJnE3YeUO5PcMtBNyZ9TkUqElHczPD-VZY9S1gXXSGeue37zGvrbfuf5XoErLFYqzisLQQY2wJBmI_LrfhGoaMuGX15cBT-jhhRxeEHk31yS1esIfEU4cf2d49BnGT4fgv-U23_6V4kdws335X_MeBM3BFCUlBpqhxR2zruD2aFoIArhoP_mDW_eoo_kqiKy_wDHQVAGO6NDcN7EaO5K0b82aqn78NhvET827iEW0VsyQ7eCq7uOOscY_KG6cU4du0tGZZotiZMCCICsopfysfNKa9haUMmtSDv2LszGek19s2jD_BG7dUWXaWXm5YcKqH_F8AaZZqRWyw",
        },
        method: "POST",
        body,
      }
    );
    console.log(response);
    res.send(response);
  } catch (err) {
    console.log(err);
  }
}

router.get("/samlCallback", callSamlCallback);
export { router as SamlRouter };
