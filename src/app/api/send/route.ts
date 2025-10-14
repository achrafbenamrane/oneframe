import wilayasData from '../../data/wilayas.json';

interface Wilaya {
  en: string;
  ar: string;
  code: string;
  communes: Array<{
    id: string;
    en: string;
    ar: string;
  }>;
}

interface WilayasData {
  [key: string]: Wilaya;
}

export async function POST(req: Request) {
  try {
    // Validate environment variables
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing environment variables:', { 
        hasBotToken: !!TELEGRAM_BOT_TOKEN, 
        hasChatId: !!TELEGRAM_CHAT_ID 
      });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Configuration error' 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { productId, name, wilaya: wilayaId, commune: communeId, number } = body;

    // Get wilaya and commune names
    let wilayaName = '-';
    let communeName = '-';
    
    const typedWilayasData = wilayasData as WilayasData;
    if (wilayaId && typedWilayasData[wilayaId]) {
      wilayaName = typedWilayasData[wilayaId].ar; // Using Arabic names
      const selectedCommune = typedWilayasData[wilayaId].communes.find(
        (c) => c.id === communeId
      );
      if (selectedCommune) {
        communeName = selectedCommune.ar; // Using Arabic names
      }
    }    if (!number) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Phone number is required' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Format message for Telegram based on whether it's an order or newsletter
    let text;
    if (productId || name || wilayaId || communeId) {
      // This is a full order
      text = `📩 *New Order Received!*

🆔 Product ID: ${productId || '-'}
👤 Name: ${name || '-'}
📍 Location: ${wilayaName}, ${communeName}
📱 Phone: ${number || '-'}`;
    } else {
      // This is a newsletter subscription
      text = `🎨 New 3D Frame Request

📱 Number: ${number}

✨ Client requested personalized 3D frame information`;
    }

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

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send message',
          details: telegramData
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Message sent successfully'
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
