import express from "express";
import Chat from "../models/Chat.js";
import authMiddleware from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

/**
 * ✅ Inbox Route - Fetch all conversations where the logged-in user is the receiver (author)
 * Groups by sender and returns last message for each sender
 */
// Inbox - get last message from each sender
router.get("/inbox/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            { senderId: userObjectId },
            { receiverId: userObjectId }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userObjectId] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$text" },
          lastMessageAt: { $first: "$createdAt" }
        }
      },{
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          lastMessageAt: 1,
          senderName: "$userDetails.name" // 🔹 Get sender name
        }
      }
    ]);

    res.json(chats);
  } catch (err) {
    console.error("❌ Error fetching inbox:", err);
    res.status(500).json({ message: "Error fetching inbox" });
  }
});

// Chat history
router.get("/:receiverId", authMiddleware, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.params;

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 }); // ✅ Correct sorting

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat" });
  }
});

export default router