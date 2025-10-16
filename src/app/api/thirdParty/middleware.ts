import crypto from "node:crypto";

// middleware.ts أو في API داخلي عند تحميل الصفحة
type GlobalWithFingerprints = typeof globalThis & {
  __trustedFingerprints?: Set<string>;
};

const globalObject = globalThis as GlobalWithFingerprints;

if (!globalObject.__trustedFingerprints) {
  globalObject.__trustedFingerprints = new Set<string>();
}

export const trustedFingerprints = globalObject.__trustedFingerprints;

export const FINGERPRINT_SESSION_COOKIE = "fp_session";
export const FINGERPRINT_SESSION_TTL_MS = 10 * 60 * 1000;

function resolveFingerprintSecret(): string | null {
  const secret = process.env.FINGERPRINT_SESSION_SECRET || process.env.X_API_SECRET;
  return secret && secret.length > 0 ? secret : null;
}

function buildSignaturePayload(fingerprint: string, issuedAt: number): string {
  return `${fingerprint}.${issuedAt}`;
}

export async function registerFingerprint(fingerprint: string, ttlMs = FINGERPRINT_SESSION_TTL_MS) {
  trustedFingerprints.add(fingerprint);
  const timeout = setTimeout(() => trustedFingerprints.delete(fingerprint), ttlMs);
  if (typeof timeout.unref === "function") {
    timeout.unref();
  }
}

export function createFingerprintSessionToken(fingerprint: string, ttlMs = FINGERPRINT_SESSION_TTL_MS): {
  token: string;
  expiresAt: Date;
} | null {
  const secret = resolveFingerprintSecret();
  if (!secret) {
    return null;
  }

  const issuedAt = Date.now();
  const payload = buildSignaturePayload(fingerprint, issuedAt);
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const token = `${payload}.${signature}`;
  const expiresAt = new Date(issuedAt + ttlMs);

  return { token, expiresAt };
}

export function validateFingerprintSession(fingerprint: string, token: string | undefined, ttlMs = FINGERPRINT_SESSION_TTL_MS): boolean {
  if (!token) {
    return false;
  }

  const [tokenFingerprint, issuedAtString, signature] = token.split(".");
  if (!tokenFingerprint || !issuedAtString || !signature) {
    return false;
  }

  if (tokenFingerprint !== fingerprint) {
    return false;
  }

  const issuedAt = Number(issuedAtString);
  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  if (Date.now() - issuedAt > ttlMs) {
    return false;
  }

  const secret = resolveFingerprintSecret();
  if (!secret) {
    return false;
  }

  const payload = buildSignaturePayload(tokenFingerprint, issuedAt);
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  const received = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (received.length !== expected.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(received, expected);
  } catch {
    return false;
  }
}
