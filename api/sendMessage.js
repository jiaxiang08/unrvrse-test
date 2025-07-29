/**
 * EXAMPLE BACKEND FUNCTION (Serverless)
 * --------------------------------------
 * HOW TO USE:
 * 1. Place this file in an `/api` directory in your project.
 * 2. Deploy your project to a host that supports serverless functions (e.g., Vercel, Netlify).
 * 3. Set the `TELEGRAM_BOT_TOKEN` as a secret environment variable in your host's settings.
 *
 * This function creates a secure endpoint at `[your-url]/api/sendMessage`.
 * It is NOT part of the frontend app bundle. It runs on a server.
 */

// A simple text cleaner to make the AI response more readable in a Telegram chat.
const cleanTextForTelegram = (text) => {
  return text
    .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
    .replace(/<p>/gi, '')         // Remove <p> tags
    .replace(/<\/p>/gi, '\n')      // Replace </p> with newlines
    .replace(/<\/?(ul|li|strong)>/g, '') // Remove other simple tags
    .replace(/###\s*(.*?)\s*###/g, '*$1*') // Bold headings (###...### -> *...*)
    .replace(/###\s(.*?)\n/g, '*$1*\n')  // Bold headings (### ... \n -> *...*\n)
    .replace(/•/g, '-') // Change bullets to dashes
    .replace(/\n\s*\n/g, '\n') // Collapse multiple newlines
    .trim();
};

// The main handler for the serverless function.
// The exact signature might vary slightly by provider (e.g., `(req, res)` for Vercel).
export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Securely read the Bot Token from server environment variables
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN environment variable not set on the server.");
    return new Response('Server configuration error.', { status: 500 });
  }

  try {
    const { chatId, text } = await request.json();

    if (!chatId || !text) {
      return new Response('Missing `chatId` or `text` in request body.', { status: 400 });
    }

    const cleanedText = cleanTextForTelegram(text);
    const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const apiResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: cleanedText,
        parse_mode: 'Markdown' // Use Markdown for formatting like *bold* text
      }),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("Telegram API Error:", errorBody);
      return new Response(`Failed to send message: ${errorBody}`, { status: apiResponse.status });
    }

    // Success
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Backend function error:", error);
    return new Response('Internal server error.', { status: 500 });
  }
}
