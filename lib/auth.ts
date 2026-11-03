import crypto from "node:crypto";

export const SESSION_COOKIE = "scorpion_admin_session";

function secret() {
  return process.env.AUTH_SECRET || "scorpion-local-development-secret";
}

export function createSessionToken(email: string) {
  const payload = `${email}:${Date.now()}`;
  const signature = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function isValidSession(token?: string) {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [email, timestamp, signature] = decoded.split(":");
    if (!email || !timestamp || !signature || Date.now() - Number(timestamp) > 1000 * 60 * 60 * 24 * 7) return false;
    const expected = crypto.createHmac("sha256", secret()).update(`${email}:${timestamp}`).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch { return false; }
}

export function adminCredentialsValid(email: string, password: string) {
  return email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@scorpion.com").toLowerCase()
    && password === (process.env.ADMIN_PASSWORD || "Scorpion!Admin_2026#HQ");
}
