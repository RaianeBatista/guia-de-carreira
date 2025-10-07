import { NextResponse } from "next/server";

const STACKSPOT_IDM =
  process.env.NEXT_PUBLIC_STACKSPOT_IDM_URL || "https://idm.stackspot.com";
const REALM = process.env.NEXT_PUBLIC_STACKSPOT_REALM || "";
const CLIENT_ID =
  process.env.STACKSPOT_CLIENT_ID || process.env.CLIENT_ID || "";
const CLIENT_SECRET =
  process.env.STACKSPOT_CLIENT_SECRET ||
  process.env.CLIENT_KEY ||
  process.env.STACKSPOT_CLIENT_KEY ||
  "";

export async function GET() {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REALM) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing STACKSPOT_CLIENT_ID, STACKSPOT_CLIENT_SECRET or NEXT_PUBLIC_STACKSPOT_REALM",
        },
        { status: 400 }
      );
    }

    const authUrl = `${STACKSPOT_IDM}/${REALM}/oidc/oauth/token`;

    const form = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const res = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { ok: false, status: res.status, error: text },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Return minimal safe info: token length and expiry if available
    const tokenPreview =
      typeof data.access_token === "string"
        ? data.access_token.substring(0, 8) + "..."
        : null;
    const expiresIn = data.expires_in || null;

    return NextResponse.json({ ok: true, tokenPreview, expiresIn });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
