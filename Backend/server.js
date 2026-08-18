require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "Coding Bot API is running"
    });
});

app.post("/generate", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                error: "Question is required"
            });
        }

        const result = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content: `
You are a coding generator.

Convert the user's request directly into a working program.

Rules:
- Return ONLY the complete source code.
- Do NOT create or rewrite the question.
- Do NOT provide explanation.
- Do NOT provide sample input or output.
- Do NOT use Markdown.
- Do NOT use code fences.
- Use the programming language requested by the user.
- If no language is specified, use Python.
- Make the program complete and runnable.
- Include input handling and output handling when appropriate.
- Keep the code simple and suitable for a programming lab.
`
                },
                {
                    role: "user",
                    content: question.trim()
                }
            ],

            temperature: 0.2
        });

        const answer = result.choices[0].message.content;

        res.json({
            success: true,
            answer: answer
        });

    } catch (error) {

        console.error("Groq error:", error);

        res.status(500).json({
            success: false,
            error: "Generation failed"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Coding Bot running on port ${PORT}`);
});
