import express from "express";
import History from "../models/History.js"; // Create History model
import authMiddleware from "../middleware/authMiddleware.js"; // If you have user auth

const router = express.Router();

// Save history
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.user.id; // From auth middleware

    const newHistory = new History({
      userId,
      location,
      date: new Date(),
    });

    await newHistory.save();
    res.json({ message: "Search saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving search" });
  }
});

// Get history
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await History.find({ userId }).sort({ date: -1 }).limit(5);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching history" });
  }
});

export default router;
