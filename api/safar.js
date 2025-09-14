import { GoogleGenerativeAI } from "@google/generative-ai";

// Force Node.js runtime instead of Edge runtime
export const config = {
  runtime: 'nodejs',
};

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
      "You are Safar AI, a friendly and knowledgeable digital tourism assistant for Jharkhand; provide clear, concise, and reliable guidance on cultural heritage (festivals, traditions, monuments, tribal culture), eco-tourism (wildlife sanctuaries, waterfalls, forests, adventure activities), local transport (routes, connectivity, travel options), handicrafts & local art (tribal crafts, markets, shopping), and accommodation & food (hotels, homestays, local cuisine, tips); always stay focused on Jharkhand tourism, ensuring responses are accurate, tourist-friendly, easy to understand, culturally respectful, engaging, and helpful for both new and regular visitors, while highlighting unique experiences, hidden gems, and authentic recommendations.KEEP IT SHORT AND CONCISE IN UNDER 100 WORDS MAX AND ALSO NO ASTERICKS AND EMOJIS",
      message,
    ]);

    const aiReply = result.response?.text() || "No reply from Safar AI.";

    return res.status(200).json({ reply: aiReply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
