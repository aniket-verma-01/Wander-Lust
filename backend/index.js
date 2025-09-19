import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

// Import Models & Routes
import Chat from "./models/Chat.js";
import authRoutes from "./routes/Auth.js";
import itineraryRoute from "./routes/itineraryRoute.js";
import historyRoute from "./routes/historyRoute.js";
import guideRoute from "./routes/guideRoute.js";
import chatRoute from "./routes/chatRoute.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // 🔹 After frontend deploy, replace * with frontend URL
    methods: ["GET", "POST"],
  },
});

// ES Modules dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/itinerary", itineraryRoute);
app.use("/api/history", historyRoute);
app.use("/api/guides", guideRoute);
app.use("/api/chat", chatRoute);

// ✅ SOCKET.IO SETUP
io.on("connection", (socket) => {
  console.log(`🔵 User connected: ${socket.id}`);

  socket.on("joinRoom", ({ userId }) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${socket.id} joined personal room for userId: ${userId}`);
    }
  });

  socket.on("sendMessage", async (messageData) => {
    try {
      const { roomId, senderId, senderName, receiverId, text } = messageData;
      if (!roomId || !senderId || !senderName || !receiverId || !text) return;

      const chat = new Chat({ senderId, senderName, receiverId, text });
      await chat.save();

      io.to(roomId).emit("receiveMessage", {
        senderId,
        senderName,
        text,
        timestamp: new Date(),
      });

      io.to(receiverId).emit("newInboxMessage", {
        senderId,
        senderName,
        receiverId,
        text,
        timestamp: new Date(),
      });

    } catch (err) {
      console.error("❌ Error saving chat:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`🚀 Server running with Socket.IO on ${PORT}`)
);
