import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("History", historySchema);
