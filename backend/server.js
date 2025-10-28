import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import meetingRoutes from "./routes/meetings.js";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/meetings", meetingRoutes);
app.use("/ai", aiRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
