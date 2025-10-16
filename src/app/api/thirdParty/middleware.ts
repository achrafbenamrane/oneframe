// middleware.ts أو في API داخلي عند تحميل الصفحة
type GlobalWithFingerprints = typeof globalThis & {
  __trustedFingerprints?: Set<string>;
};

const globalObject = globalThis as GlobalWithFingerprints;

if (!globalObject.__trustedFingerprints) {
  globalObject.__trustedFingerprints = new Set<string>();
}

export const trustedFingerprints = globalObject.__trustedFingerprints;

export async function registerFingerprint(fingerprint: string, ttlMs = 10 * 60 * 1000) {
  trustedFingerprints.add(fingerprint);
  const timeout = setTimeout(() => trustedFingerprints.delete(fingerprint), ttlMs);
  if (typeof timeout.unref === "function") {
    timeout.unref();
  }
}
