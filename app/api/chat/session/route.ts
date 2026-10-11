import { NextResponse } from "next/server";
import {
  createChallengeSecret,
  encryptChallengeSecret,
  getSessionEncryptionKey,
  setGatekeeperSessionCookie,
} from "../../../../lib/gatekeeper-session";

export async function POST() {
  const encryptionKey = getSessionEncryptionKey();

  if (!encryptionKey) {
    return NextResponse.json(
      {
        error:
          "Server configuration is missing or invalid GATEKEEPER_SESSION_KEY.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const secret = createChallengeSecret();
  const encryptedSecret = encryptChallengeSecret(secret, encryptionKey);
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );

  setGatekeeperSessionCookie(response, encryptedSecret);
  return response;
}
