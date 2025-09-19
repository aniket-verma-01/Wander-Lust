// backend/routes/guideRoute.js
import express from "express";
import Guide from "../models/Guide.js";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Create or update guide text (requires login)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { location, content } = req.body;
    const userId = req.user.id;

    if (!location || !content) {
      return res.status(400).json({ message: "Location and content are required" });
    }

    // Get author name from User model
    const user = await User.findById(userId);
    const authorName = user?.name || "User";

    const guide = await Guide.findOneAndUpdate(
      { location },
      {
        $set: {
          content,
          userId,
          authorName,
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: "Guide saved successfully", guide });
  } catch (err) {
    console.error("Error saving guide:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload photos (store userId with each photo)
router.post("/upload-photos", authMiddleware, upload.array("photos", 5), async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.user.id;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const photoObjects = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      userId,
    }));

    const guide = await Guide.findOneAndUpdate(
      { location },
      { $push: { photos: { $each: photoObjects } } },
      { new: true, upsert: true }
    );

    res.json({ message: "Photos uploaded", photos: guide.photos });
  } catch (err) {
    console.error("Error uploading photos:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all guides
router.get("/all", async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ message: "Error fetching guides" });
  }
});

// Fetch single guide by location
router.get("/:location", async (req, res) => {
  try {
    const guide = await Guide.findOne({ location: req.params.location });
    if (!guide) return res.status(404).json({ message: "Guide not found" });

    res.json(guide);
  } catch (err) {
    res.status(500).json({ message: "Error fetching guide" });
  }
});

export default router;
