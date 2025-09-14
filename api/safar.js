import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: "edge", // Ensures compatibility with Vercel Edge Functions
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "API key is missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { message } = body;
  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      "You are Safar AI, a digital tourism assistant for Jharkhand. Provide clear, concise, and reliable travel guidance, including cultural heritage, eco-tourism, local transport, handicrafts, and accommodations. Always focus on Jharkhand tourism.",
      message,
    ]);

    const aiReply = result.response?.text() || "No reply from Safar AI.";

    return new Response(JSON.stringify({ reply: aiReply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
