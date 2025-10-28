// routes/ai.js
import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/schedule", async (req, res) => {
  const { plan, userId } = req.body;

  if (!plan || !userId) {
    return res.status(400).json({ error: "plan and userId are required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Scheduler",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free", // Changed to a more reliable free model
        messages: [
          {
            role: "system",
            content: `You are an intelligent daily planner. The user will describe their day, and you must respond ONLY with a valid JSON array of meetings. Each meeting must have: title (string), date (YYYY-MM-DD format), and time (e.g., "10:00 AM"). Today's date is ${new Date().toISOString().split("T")[0]}. Return ONLY the JSON array, no explanations or markdown.

Example format:
[
  {"title": "Morning standup", "date": "2025-10-28", "time": "9:00 AM"},
  {"title": "Client call", "date": "2025-10-28", "time": "2:00 PM"}
]`,
          },
          {
            role: "user",
            content: plan,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON output
        max_tokens: 1000,
      }),
    });

    // Parse the JSON response
    const data = await response.json();

    console.log("Full Response:", JSON.stringify(data, null, 2));

    // Check for API errors
    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      return res.status(500).json({ 
        error: "AI API Error", 
        details: data.error.message,
        suggestion: "Please check your OpenRouter settings at https://openrouter.ai/settings/privacy and ensure data sharing is enabled for free models, or use a paid model."
      });
    }

    if (!data.choices || !data.choices.length) {
      throw new Error("No choices returned from AI API: " + JSON.stringify(data));
    }

    // Extract text safely
    let text = data.choices[0].message.content.trim();
    console.log("AI Raw Response:", text);

    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Try to parse the JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Text that failed to parse:", text);
      return res.status(500).json({ 
        error: "Invalid AI response format", 
        raw: text,
        details: "The AI did not return valid JSON. Please try rephrasing your request."
      });
    }

    // Ensure parsed is an array
    if (!Array.isArray(parsed)) {
      return res.status(500).json({ 
        error: "AI response is not an array", 
        raw: text 
      });
    }

    // Validate each meeting object
    const validMeetings = [];
    for (const item of parsed) {
      if (item.title && item.date && item.time) {
        validMeetings.push(item);
      } else {
        console.warn("Skipping invalid meeting:", item);
      }
    }

    if (validMeetings.length === 0) {
      return res.status(500).json({ 
        error: "No valid meetings found in AI response", 
        raw: text 
      });
    }

    // Insert meetings into database
    const stmt = db.prepare(
      "INSERT INTO meetings (title, date, time, user_id) VALUES (?, ?, ?, ?)"
    );

    for (const item of validMeetings) {
      stmt.run(item.title, item.date, item.time, userId);
    }

    res.json({ success: true, added: validMeetings, count: validMeetings.length });
  } catch (err) {
    console.error("AI Scheduling Error:", err);
    res.status(500).json({ 
      error: "AI scheduling failed", 
      details: err.message 
    });
  }
});

export default router;