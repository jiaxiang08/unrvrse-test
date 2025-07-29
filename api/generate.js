import { GoogleGenAI } from '@google/genai';

/**
 * SECURE BACKEND FUNCTION (Serverless)
 * --------------------------------------
 * This function acts as a secure proxy to the Google Gemini API.
 * 1. It receives a 'prompt' from the frontend application.
 * 2. It securely accesses the `API_KEY` environment variable on the server.
 * 3. It calls the Gemini API and returns the result to the frontend.
 *
 * This prevents the secret API_KEY from ever being exposed in the user's browser.
 */
export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Securely read the API Key from server environment variables
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    console.error("API_KEY environment variable not set on the server.");
    return new Response(JSON.stringify({ error: 'Server configuration error: API_KEY is missing.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing `prompt` in request body.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;

    // Success: return the generated text
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Gemini API call error in backend:", error);
    return new Response(JSON.stringify({ error: 'An error occurred while communicating with the AI service.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
