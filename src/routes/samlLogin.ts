import { Request, Response, Router, urlencoded } from "express";
import cors from "cors";
import { FE_BASE_URL, FE_TENANT_JWT } from "..";

const router = Router();

interface IDPSamlResponse {
  SAMLResponse: string;
  RelayState: string;
}

async function getRefreshToken(SamlBody: IDPSamlResponse): Promise<string> {
  const body = JSON.stringify(SamlBody);
  const response = await fetch(`${FE_BASE_URL}/auth/saml/callback`, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "manual",
  });

  let RT = "";

  // Check if the server is attempting to redirect
  if (response.status === 302) {
    // Fetch the `Set-Cookie` header
    const setCookieHeader = response.headers.get("set-cookie");
    const location = response.headers.get("location");
    const urlParams = new URLSearchParams(new URL(location).search);

    // Get the value of the samlerrors parameter
    const error = urlParams.get("samlerrors");
    if (error) {
      throw new Error(error);
    }

    console.log("Set-Cookie Header:", setCookieHeader);

    if (!setCookieHeader) {
      throw new Error("No cookies returned in the response!");
    }

    // Extract the refresh token from the `Set-Cookie` header
    const refreshTokenMatch = setCookieHeader.match(/fe_refresh_[^=]+=[^;]+/);
    const refreshToken = refreshTokenMatch ? refreshTokenMatch[0] : null;

    if (refreshToken) {
      console.log("Extracted Refresh Token:", refreshToken);
      RT = refreshToken;
    } else {
      console.log("Refresh token not found in the Set-Cookie header!");
      throw new Error(
        "Refresh token not found in the Set-Cookie header! " + setCookieHeader
      );
    }
  } else {
    console.log(`Unexpected status code: ${response.status}`);
  }

  const cookies = response.headers.get("set-cookie");
  console.log("Set-Cookie Header:", cookies);
  console.log("----------------------------------------------------------");

  console.log("logging response for /auth/saml/callback");
  console.log(response);
  console.log("----------------------------------------------------------");

  console.log("refresh token found: ", RT);

  console.log("----------------------------------------------------------\n");

  console.log("logging response for /refresh");
  console.log(response);
  console.log("----------------------------------------------------------\n");
  return RT;
}

async function callSamlCallback(req: Request, res: Response) {
  try {
    let { body } = req;
    console.log("----------------------------------------------------------");
    console.log("logging request, should have relay state and saml response");

    console.log("----------------------------------------------------------");

    const refreshToken = await getRefreshToken(body);
    // append the refresh token as a cookie
    res.cookie("fe_refresh", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Ensure it's HTTPS in production
      maxAge: 3600000, // Cookie expiration time
      domain: ".app-kcj0djtbjuee.frontegg.com", // has to be your frontegg domain!!
    });

    res.status(302).redirect("http://localhost:5500/saml/callback");

    // const refresh = await fetch(
    //   `${FE_BASE_URL}/identity/resources/auth/v2/user/token/refresh`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Cookie: refreshToken,
    //     },
    //     redirect: "follow",
    //   }
    // );

    // const data = await refresh.json();
    // console.log(data);
    // res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
}

router.post(
  "/auth/saml/callback",
  urlencoded({ extended: true }),
  callSamlCallback
);

export { router as SamlRouter };
