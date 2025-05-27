import { Request, Response, Router, urlencoded } from "express";
import cors from "cors";

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

    if (!location) {
      console.error(
        "[getRefreshToken] Error: No location header found in redirect response"
      );
      throw new Error("could not find location to get request cookies");
    }

    const urlParams = new URLSearchParams(new URL(location).search);
    const error = urlParams.get("samlerrors");

    if (error) {
      console.error("[getRefreshToken] SAML error detected:", error);
      throw new Error(error);
    }

    if (!setCookieHeader) {
      console.error(
        "[getRefreshToken] Error: No Set-Cookie header in response"
      );
      throw new Error("No cookies returned in the response!");
    }

    // Extract the refresh token from the `Set-Cookie` header
    const refreshTokenMatch = setCookieHeader.match(/fe_refresh_[^=]+=[^;]+/);
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
    // The IdP will send a body with SAMLRequest and RelayState
    let { body } = req;
    console.log("[callSamlCallback] Processing SAML response body");

    // send a request to FE with the saml details and get back a refresh token
    const { setCookieHeader } = await getRefreshToken(body);
    console.log("[callSamlCallback] Successfully obtained refresh token");

    const isProduction = process.env.NODE_ENV === "production";
    console.log("[callSamlCallback] Environment:", { isProduction });

    // Set CORS headers before setting the cookie
    const origin = req.headers.origin ? req.headers.origin : FE_BASE_URL!;
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Expose-Headers", "set-cookie");

    // Forward the Set-Cookie header from Frontegg's response
    if (setCookieHeader) {
      // Split multiple cookies if present
      const cookies = setCookieHeader.split(",").map((cookie) => cookie.trim());

      // Process each cookie
      const modifiedCookies = cookies.map((cookie) => {
        // Only modify the refresh token cookie
        if (cookie.startsWith("fe_refresh_")) {
          const cookieParts = cookie.split(";").map((part) => part.trim());

          // Find and modify the SameSite attribute
          const sameSiteIndex = cookieParts.findIndex((part) =>
            part.toLowerCase().startsWith("samesite=")
          );
          if (sameSiteIndex !== -1) {
            cookieParts[sameSiteIndex] = "SameSite=Lax";
          } else {
            cookieParts.push("SameSite=Lax");
          }

          // Add or update the domain
          const domainIndex = cookieParts.findIndex((part) =>
            part.toLowerCase().startsWith("domain=")
          );
          if (domainIndex !== -1) {
            cookieParts[domainIndex] = `Domain=${COOKIE_DOMAIN}`;
          } else {
            cookieParts.push(`Domain=${COOKIE_DOMAIN}`);
          }

          return cookieParts.join("; ");
        }
        // Return other cookies unchanged
        return cookie;
      });

      // Set all cookies
      res.setHeader("Set-Cookie", modifiedCookies);
    }

    console.log("[callSamlCallback] Setting response headers:", {
      origin,
      hasCredentials: true,
      forwardedCookie: setCookieHeader,
    });

    console.log("[callSamlCallback] Response headers set:", res.getHeaders());

    // Set the location header for redirect
    res.setHeader("Location", "http://localhost:5500/saml/callback");
    // Use 302 status code for redirect
    return res.status(302).end();
  } catch (err) {
    console.error("[callSamlCallback] Error processing SAML callback:", {
      error: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
    res.status(500).send(err);
  }
}

router.post(
  "/auth/saml/callback", // your ACS URL set up on Okta will point to here
  urlencoded({ extended: true }),
  callSamlCallback
);

export { router as SamlRouter };
