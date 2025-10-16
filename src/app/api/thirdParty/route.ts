// /src/app/api/thirdParty/route.ts
import { trustedFingerprints } from "./middleware";

export async function POST(req: Request) {
  try {
    const API_SECRET = process.env.X_API_SECRET;
    // تأكد أن BASE_URL لا ينتهي بشرطة مائلة
    const rawBase = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const BASE_URL = rawBase.replace(/\/+$/, ""); // remove trailing slash(es)

    if (!API_SECRET || !BASE_URL) {
      console.error("❌ Missing environment variables", { API_SECRET: !!API_SECRET, BASE_URL });
      return new Response(
        JSON.stringify({ success: false, error: "Server not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Origin / Referer / Host checks (تأكد من السماح للقيم الصحيحة)
    const origin = req.headers.get("origin") || "";
    const referer = req.headers.get("referer") || "";
    const host = req.headers.get("host") || "";

    // عدّل هذه القائمة لتحتوي على النطاقات الفعلية لموقعك (بدون trailing slash)
    const allowedOrigins = [BASE_URL, "http://localhost:3000", "https://www.oneframe.me"];

    // دقيق أكثر: نحاول أن نقارن origin.origin وليس startsWith لأنها قد تخدع
    let isAllowed = false;
    try {
      const check = origin || referer;
      if (check) {
        const parsed = new URL(check);
        isAllowed = allowedOrigins.some((a) => {
          try {
            return new URL(a).origin === parsed.origin;
          } catch {
            // allowedOrigins item could be plain host like 'localhost:3000'
            return parsed.origin.includes(a);
          }
        });
      } else {
        // no origin/referer header (مثلاً بعض clients) — نسمح للـ localhost فقط
        isAllowed = host.includes("localhost");
      }
    } catch (e) {
      console.warn("Origin parse failed", e);
      isAllowed = host.includes("localhost");
    }

    if (!isAllowed) {
      console.warn("🚫 Unauthorized origin:", { origin, referer, host });
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden: Invalid Origin" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));

    if (!body?.fingerprint || !trustedFingerprints.has(body.fingerprint)) {
      return new Response(
        JSON.stringify({ success: false, error: "Go fuck yourself" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    // basic validation
    if (!body || !body.number) {
      return new Response(JSON.stringify({ success: false, error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔐 إعادة توجيه الطلب إلى API الداخلي /api/sendMessageTelegram
    const targetUrl = `${BASE_URL}/api/sendMessageTelegram`;
    console.log("Proxying to:", targetUrl);

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": API_SECRET, // يتم اضافته من السيرفر فقط
      },
      body: JSON.stringify(body),
    });

    // افحص نوع المحتوى قبل محاولة parse
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text(); // اقرأ النص دائماً — سنحاول تحليل JSON إن أمكن
    if (contentType.includes("application/json")) {
      try {
        const data = JSON.parse(text);
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        });
      } catch (jsonErr) {
        console.error("Failed to parse JSON from target:", jsonErr);
        // إرجاع نص الرد مع حالة 502 لتوضيح أن البروكسي فشل في تفسير الرد
        return new Response(
          JSON.stringify({ success: false, error: "Invalid JSON from upstream", raw: text.slice(0, 1000) }),
          { status: 502, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      // الرد ليس JSON — غالباً HTML (خطأ/redirect). سجّله للمراجعة.
      console.error("Upstream returned non-JSON (maybe HTML). status:", res.status, "content-type:", contentType);
      console.error("Upstream body preview:", text.slice(0, 1000));
      return new Response(
        JSON.stringify({ success: false, error: "Upstream returned non-JSON response", status: res.status, raw: text.slice(0, 1000) }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Proxy API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
