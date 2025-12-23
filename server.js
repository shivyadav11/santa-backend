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

    // 🔥 Random roast style
    const styles = [
      "sarcastic",
      "playful savage",
      "witty and clever",
      "dramatic and funny",
      "friendly roast"
    ];

    const randomStyle =
      styles[Math.floor(Math.random() * styles.length)];

    // 🌐 Language instruction
    let languageInstruction = "";
    if (language === "hindi") {
      languageInstruction = "Respond ONLY in Hindi (Devanagari script).";
    } else if (language === "english") {
      languageInstruction = "Respond ONLY in English.";
    } else {
      languageInstruction =
        "Respond in Hinglish (mix of Hindi and English, casual Indian tone).";
    }

    // 🎅 Final prompt
    const prompt = `
You are Santa Claus with a ${randomStyle} personality.
Roast the user in a light-hearted, clean, Christmas-themed way.
Make every roast DIFFERENT and CREATIVE.
Use witty jokes, analogies, and playful sarcasm.
Do NOT use abusive or hateful language.
${languageInstruction}
End with emojis.

User name: ${name}
`;

    const response = await openai.chat.completions.create({
       model: "gpt-4o-mini",

      messages: [{ role: "user", content: prompt }],
      temperature: 1.0,
      max_tokens: 120,
    });

    const roast = response.choices[0].message.content;
    res.json({ roast });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({ error: "Santa is busy right now 🎅" });
  }
});

app.get("/", (req, res) => {
  res.send("🎅 AI Christmas Roast Backend is running!");
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log("Backend running on port 3001");
});


