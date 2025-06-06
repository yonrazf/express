import { Request, Response, Router, urlencoded } from "express";
import cors from "cors";
import { handleSamlFlowErrors } from "../utils/samlUtils";

const FE_BASE_URL = "https://auth.sabich.life";

const router = Router();

// Configure CORS middleware
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true, // Allow credentials (cookies)
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

// Apply CORS middleware to the router
router.use(cors(corsOptions));

const COOKIE_DOMAIN = "api.sabich.life";

interface IDPSamlResponse {
  SAMLResponse: string;
  RelayState: string;
}

async function getRefreshToken(
  SamlBody: IDPSamlResponse
): Promise<{ refreshToken: string; setCookieHeader: string | null }> {
  console.log("[getRefreshToken] Starting refresh token retrieval process");
  console.log("[getRefreshToken] SAML Body received:", {
    hasSAMLResponse: !!SamlBody.SAMLResponse,
    hasRelayState: !!SamlBody.RelayState,
  });

  const body = JSON.stringify(SamlBody);
  console.log(
    "[getRefreshToken] Sending request to FE:",
    `${FE_BASE_URL}/auth/saml/callback`
  );

  // send a request to FE in order to get back a refresh cookie
  const response = await fetch(`${FE_BASE_URL}/auth/saml/callback`, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "manual", // redirect must be manual as to not lose the cookie
  });

  console.log("[getRefreshToken] Received response from FE:", {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  // Check if the server is attempting to redirect
  if (response.status === 302) {
    // Fetch the `Set-Cookie` header
    const setCookieHeader = response.headers.get("set-cookie");
    const location = response.headers.get("location");

    console.log("[getRefreshToken] Processing redirect response:", {
      hasSetCookie: !!setCookieHeader,
      location,
    });

    handleSamlFlowErrors(location, setCookieHeader);

    // Extract the refresh token from the `Set-Cookie` header
    const refreshTokenMatch = setCookieHeader!.match(/fe_refresh_[^=]+=[^;]+/);
    const refreshToken = refreshTokenMatch ? refreshTokenMatch[0] : null;

    if (refreshToken) {
      console.log("[getRefreshToken] Successfully extracted refresh token");
      return { refreshToken, setCookieHeader };
    } else {
      console.error(
        "[getRefreshToken] Error: Refresh token not found in Set-Cookie header:",
        setCookieHeader
      );
      throw new Error(
        "Refresh token not found in the Set-Cookie header! " + setCookieHeader
      );
    }
  } else {
    console.error(
      "[getRefreshToken] Error: Unexpected status code:",
      response.status
    );
    throw new Error(`Unexpected status code: ${response.status}`);
  }
}

async function callSamlCallback(req: Request, res: Response) {
  console.log("[callSamlCallback] Starting SAML callback processing");
  console.log("[callSamlCallback] Request details:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
  });

  try {
    let { body } = req;
    console.log("[callSamlCallback] Processing SAML response body");

    const { setCookieHeader, refreshToken } = await getRefreshToken(body);
    console.log("[callSamlCallback] Successfully obtained refresh token");

    const isProduction = process.env.NODE_ENV === "production";
    console.log("[callSamlCallback] Environment:", { isProduction });

    // Set CORS headers before setting the cookie
    const origin = req.headers.origin ? req.headers.origin : FE_BASE_URL!;
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Expose-Headers", "set-cookie");

    // Forward the Set-Cookie header from Frontegg's response
    const refreshTokenCookie = setCookieHeader
      .split(",")
      .find((cookie) => cookie.startsWith("fe_refresh_"));
    const refreshTokenCookieParts = refreshTokenCookie
      ?.split(";")
      .map((part) => part.trim());
    const refreshTokenCookieKeyValue = refreshTokenCookieParts[0].split("=");

    // Set the cookie with all necessary attributes
    const cookieValue = `${refreshTokenCookieKeyValue[0]}=${refreshTokenCookieKeyValue[1]}; Domain=${COOKIE_DOMAIN}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=2592000`;
    // res.append("Set-Cookie", cookieValue);
    res.cookie(refreshTokenCookieKeyValue[0], refreshTokenCookieKeyValue[1], {
      domain: COOKIE_DOMAIN,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    console.log("[callSamlCallback] Setting response headers:", {
      origin,
      hasCredentials: true,
      forwardedCookie: setCookieHeader,
      newCookie: cookieValue,
    });

    // Instead of sending a 200 response, send an HTML page that will handle the redirect
    res.location("http://api.sabich.life/account/saml/callback");
    res.redirect(302, "http://localhost:5500/saml/callback");
  } catch (err) {
    console.error("[callSamlCallback] Error processing SAML callback:", {
      error: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
    res.status(500).send(err);
  }
}

router.get("/account/saml/callback", (req, res) => {
  res.status(200).send();
});

router.post(
  "/auth/saml/callback", // your ACS URL set up on Okta will point to here
  urlencoded({ extended: true }),
  callSamlCallback
);

export { router as SamlRouter };
