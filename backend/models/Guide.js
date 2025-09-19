// backend/models/Guide.js
import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
  userId: { type: String }, // Creator of the guide
  location: { type: String, required: true },
  content: { type: String, required: true },

  // Store photos with userId for filtering
  photos: [
    {
      url: { type: String, required: true },
      userId: { type: String, required: true }
    }
  ],

  date: { type: Date, default: Date.now }
});

export default mongoose.model("Guide", guideSchema);
