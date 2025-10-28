import { useState } from "react";

export default function MeetingForm({ userId, reload }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    await fetch("http://localhost:4000/meetings", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ title, date, time, userId })
    });
    reload();
    setTitle(""); setDate(""); setTime("");
  };

  const handleAISchedule = async () => {
    if (!aiInput.trim()) return alert("Please describe your plan!");
    setLoading(true);
    const res = await fetch("http://localhost:4000/ai/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: aiInput, userId }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      alert("AI-generated schedule added!");
      setAiInput("");
      reload();
    } else {
      alert("AI failed: " + data.error);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div>
        <input placeholder="Meeting title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button onClick={handleAdd}>Add Meeting</button>
      </div>

      <hr style={{ margin: "1rem 0" }} />

      <div>
        <textarea
          placeholder="Describe your day (e.g., 'Work on project, gym at 6, call mom at night')"
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
          rows={3}
          cols={50}
        />
        <br />
        <button onClick={handleAISchedule} disabled={loading}>
          {loading ? "Generating schedule..." : "Generate with AI"}
        </button>
      </div>
    </div>
  );
}
