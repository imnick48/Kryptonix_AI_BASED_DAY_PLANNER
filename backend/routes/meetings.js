import express from "express";
import db from "../db.js";

const router = express.Router();

// Create meeting
router.post("/", (req, res) => {
  const { title, date, time, userId } = req.body;
  db.prepare("INSERT INTO meetings (title, date, time, user_id) VALUES (?, ?, ?, ?)").run(title, date, time, userId);
  res.json({ success: true });
});

// Get meetings
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const meetings = db.prepare("SELECT * FROM meetings WHERE user_id=?").all(userId);
  res.json(meetings);
});

// Simple AI suggestion mock
router.post("/suggest", (req, res) => {
  const { preferredTime, userId } = req.body;

  const suggestions = [
    { title: "Meeting Suggestion 1", date: "2025-10-29", time: "10:00 AM", userId },
    { title: "Meeting Suggestion 2", date: "2025-10-29", time: "2:00 PM", userId },
    { title: "Meeting Suggestion 3", date: "2025-10-30", time: "9:00 AM", userId },
  ];

  const stmt = db.prepare("INSERT INTO meetings (title, date, time, user_id) VALUES (?, ?, ?, ?)");

  for (const i of suggestions) {
    stmt.run(i.title, i.date, i.time, i.userId);
  }

  res.json({ suggestions });
});





export default router;
