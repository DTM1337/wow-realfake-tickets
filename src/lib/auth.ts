import { createHmac } from "crypto";

const COOKIE = "wow_admin";

/** Genererar en HMAC-token från lösenordet — lagras i cookien i stället för råa lösenordet. */
export function makeSessionToken(password: string): string {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", secret).update(password).digest("hex");
}

/** Verifierar att cookievärdet är en giltig session-token för det nuvarande lösenordet. */
export function isValidToken(token: string): boolean {
  if (!process.env.ADMIN_PASSWORD) return false;
  const expected = makeSessionToken(process.env.ADMIN_PASSWORD);
  // Konstanttidsjämförelse för att undvika timing-attacker
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export { COOKIE };
