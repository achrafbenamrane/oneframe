import { NextResponse } from "next/server";
import {
  FINGERPRINT_SESSION_COOKIE,
  FINGERPRINT_SESSION_TTL_MS,
  createFingerprintSessionToken,
  registerFingerprint,
} from "../middleware";

function matchOrigin(candidate: string, allowedOrigins: string[]): boolean {
  try {
    const parsed = new URL(candidate);
    return allowedOrigins.some((entry) => {
      try {
        return new URL(entry).origin === parsed.origin;
      } catch {
        return parsed.origin.includes(entry);
      }
    });
  } catch {
    return false;
  }
}

function isAllowedRequest(req: Request, allowedOrigins: string[]): boolean {
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const host = req.headers.get("host") || "";

  if (origin && matchOrigin(origin, allowedOrigins)) {
    return true;
  }
  if (referer && matchOrigin(referer, allowedOrigins)) {
    return true;
  }
  return host.includes("localhost");
}

export async function POST(req: Request) {
  try {
    const rawBase = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const BASE_URL = rawBase.replace(/\/+$/, "");
  const host = req.headers.get("host") || "";
  const hostname = host.split(":").shift() || "";
    const forwardedProto = req.headers.get("x-forwarded-proto") || "";
    const proto = forwardedProto.split(",").shift()?.trim().toLowerCase();
  const isIpAddress = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);
  const isLocalEnvironment = hostname === "localhost" || hostname.endsWith(".local") || isIpAddress;
    const isSecureCookie = !isLocalEnvironment && (proto === "https" || BASE_URL.startsWith("https://"));
    const additionalOrigins = (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
    const allowedOrigins = [BASE_URL, "http://localhost:3000", "https://www.oneframe.me", ...additionalOrigins];

    if (!isAllowedRequest(req, allowedOrigins)) {
      console.warn("Fingerprint register blocked", {
        origin: req.headers.get("origin"),
        referer: req.headers.get("referer"),
        host: req.headers.get("host"),
      });
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => null);
    const fingerprint = body?.fingerprint;

    if (typeof fingerprint !== "string" || fingerprint.length < 10) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid fingerprint" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const session = createFingerprintSessionToken(fingerprint);

    if (!session) {
      console.error("Fingerprint session secret missing");
      return new Response(
        JSON.stringify({ success: false, error: "Server not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    await registerFingerprint(fingerprint);

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: FINGERPRINT_SESSION_COOKIE,
      value: session.token,
      httpOnly: true,
      sameSite: "strict",
      secure: isSecureCookie,
      maxAge: Math.floor(FINGERPRINT_SESSION_TTL_MS / 1000),
      expires: session.expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Fingerprint register failed", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
