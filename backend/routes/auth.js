import express from "express";
import db from "../db.js";

const router = express.Router();

// Signup
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  try {
    db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, password);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username=? AND password=?").get(username, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ success: true, userId: user.id });
});

export default router;
