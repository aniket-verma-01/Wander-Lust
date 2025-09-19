// backend/routes/itineraryRoute.js
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/itinerary/generate
router.post("/generate", async (req, res) => {
  try {
    const { location, startDate, endDate, budget } = req.body;

    // ✅ Validate inputs
    if (!location || !startDate || !endDate || !budget) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prompt for OpenAI
    const prompt = `
      Create a detailed travel itinerary:
      Location: ${location}
      Dates: ${startDate} to ${endDate}
      Budget: ₹${budget}
      Break it into days, include activities, food suggestions, and must-visit places.
    `;

    // Call OpenAI Chat Completion API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if needed
      messages: [{ role: "user", content: prompt }],
    });

    // Extract the itinerary text
    const itinerary = completion.choices[0].message.content || "Unable to generate itinerary. Please try again.";

    res.json({ itinerary });
  } catch (err) {
    console.error("Itinerary generation error:", err);
    res.status(500).json({ message: "Error generating itinerary" });
  }
});

export default router;
