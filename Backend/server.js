require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.use(cors());
app.use(express.json());

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
                error: "Question is required"
            });
        }

        const result = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a programming tutor. Provide correct, concise code with a short explanation."
                },
                {
                    role: "user",
                    content: question
                }
            ],
            temperature: 0.2
        });

        res.json({
            success: true,
            answer: result.choices[0].message.content
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Generation failed"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
