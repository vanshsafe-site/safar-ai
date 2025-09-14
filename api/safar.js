import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  let body;
  try {
    body = req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { message } = body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      "You are Safar AI, a digital tourism assistant for Jharkhand. Provide clear, concise, and reliable travel guidance about cultural heritage, eco-tourism, local transport, handicrafts, and accommodations. Always focus on Jharkhand tourism.",
      message,
    ]);

    const aiReply = result.response?.text() || "No reply from Safar AI.";

    return res.status(200).json({ reply: aiReply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
