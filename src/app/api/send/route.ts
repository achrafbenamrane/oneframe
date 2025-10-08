export async function POST(req: Request) {
  const { productId, name, email, message , number} = await req.json();

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

  const text = `
📩 *New Order Received!*

🆔 Product ID: ${productId || '-'}
👤 Name: ${name}
📧 Email: ${email}
📞 Number :${number}
💬 Message: ${message}
`;

  // Send to Telegram
  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!telegramResponse.ok) {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
