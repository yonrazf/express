import crypto from "crypto";

// Generate a random token

export function getRandomString() {
  return crypto.randomBytes(16).toString("hex");
}
