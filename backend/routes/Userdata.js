// backend/routes/UserData.js
import express from "express";
import { verifyToken } from "../middleware/Authmiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

export default router;
