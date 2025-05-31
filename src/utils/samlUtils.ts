export function handleSamlFlowErrors(
  location: string | null,
  setCookieHeader: string | null
): void {
  if (!location) {
    console.error(
      "[handleSamlFlowErrors] Error: No location header found in redirect response"
    );
    throw new Error("could not find location to get request cookies");
  }

  const urlParams = new URLSearchParams(new URL(location).search);
  const error = urlParams.get("samlerrors");

  if (error) {
    console.error("[handleSamlFlowErrors] SAML error detected:", error);
    throw new Error(error);
  }

  if (!setCookieHeader) {
    console.error(
      "[handleSamlFlowErrors] Error: No Set-Cookie header in response"
    );
    throw new Error("No cookies returned in the response!");
  }
}
