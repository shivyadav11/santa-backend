import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/roast", async (req, res) => {
  try {
    const { name, language } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const styles = [
      "sarcastic",
      "playful savage",
      "witty and clever",
      "dramatic and funny",
      "friendly roast",
    ];

    const randomStyle =
      styles[Math.floor(Math.random() * styles.length)];

    let languageInstruction = "";
    if (language === "hindi") {
      languageInstruction = "Respond ONLY in Hindi (Devanagari script).";
    } else if (language === "english") {
      languageInstruction = "Respond ONLY in English.";
    } else {
      languageInstruction =
        "Respond in Hinglish (mix of Hindi and English, casual Indian tone).";
    }

    const prompt = `
You are Santa Claus with a ${randomStyle} personality.
Roast the user in a light-hearted, clean, Christmas-themed way.
Make every roast DIFFERENT and CREATIVE.
Do NOT use abusive or hateful language.
${languageInstruction}
End with emojis.

User name: ${name}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_tokens: 120,
    });

    res.json({ roast: response.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Santa is busy 🎅" });
  }
});

app.get("/", (req, res) => {
  res.send("🎅 AI Christmas Roast Backend is running!");
});

/* ❌ REMOVE THIS */
// app.listen(3001)

/* ✅ ADD THIS */
export default app;

