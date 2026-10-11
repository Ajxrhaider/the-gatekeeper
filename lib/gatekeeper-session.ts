import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";
import type { NextResponse } from "next/server";

export const GATEKEEPER_SESSION_COOKIE = "gatekeeper_session";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;
const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const SESSION_TOKEN_VERSION = "v1";

export function getSessionEncryptionKey(): Buffer | null {
  const encodedKey = process.env.GATEKEEPER_SESSION_KEY?.trim();
  if (!encodedKey) return null;

  try {
    const key = Buffer.from(encodedKey, "base64url");
    return key.length === 32 ? key : null;
  } catch {
    return null;
  }
}

export function createChallengeSecret(): string {
  return randomBytes(24).toString("base64url");
}

export function encryptChallengeSecret(secret: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final(),
  ]);
  const authenticationTag = cipher.getAuthTag();

  return [
    SESSION_TOKEN_VERSION,
    iv.toString("base64url"),
    authenticationTag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptChallengeSecret(
  encryptedSecret: string,
  key: Buffer,
): string | null {
  try {
    const parts = encryptedSecret.split(".");
    if (parts.length !== 4 || parts[0] !== SESSION_TOKEN_VERSION) return null;

    const iv = Buffer.from(parts[1], "base64url");
    const authenticationTag = Buffer.from(parts[2], "base64url");
    const ciphertext = Buffer.from(parts[3], "base64url");

    if (iv.length !== 12 || authenticationTag.length !== 16 || ciphertext.length === 0) {
      return null;
    }

    const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    decipher.setAuthTag(authenticationTag);
    const secret = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");

    return secret.length > 0 && secret.length <= 128 ? secret : null;
  } catch {
    return null;
  }
}

export function setGatekeeperSessionCookie(
  response: NextResponse,
  encryptedSecret: string,
): void {
  response.cookies.set(GATEKEEPER_SESSION_COOKIE, encryptedSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}
