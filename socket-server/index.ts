import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import Message from "./models/message";
import MeetingReport from "./models/Meetingreports";
import generateMeetingReport from "./genratemeetingrecord";
import { setupMonthlyBill } from "./cron/monthlybillgenrate";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXTJS_SERVER,
    methods: ["GET", "POST"],
  },
});

const PORT = Number(process.env.PORT) || 3001;

// -------------------- ROUTES --------------------

app.get("/messages/:meetingId", async (req, res) => {
  try {
    const messages = await Message.find({
      meetingId: req.params.meetingId,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.post("/api/end-meeting", async (req, res) => {
  const { meetingId } = req.body;

  if (!meetingId) {
    return res.status(400).json({
      success: false,
      error: "Meeting ID required",
    });
  }

  try {
    const savedReport = await generateMeetingReport(meetingId);

    if (!savedReport) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate report",
      });
    }

    return res.json({
      success: true,
      report: savedReport.report,
      id: savedReport._id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Failed to generate report",
    });
  }
});

app.get("/api/meeting-reports/:meetingId", async (req, res) => {
  try {
    const reports = await MeetingReport.find({
      meetingId: req.params.meetingId,
    });

    if (!reports.length) {
      return res.status(404).json({
        error: "No reports found for this meeting.",
      });
    }

    res.json(reports);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// -------------------- SOCKET --------------------

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send-message", async (msg) => {
    try {
      const saved = await new Message(msg).save();
      io.emit("receive-message", saved);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on(
    "react-message",
    async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      try {
        const msg = await Message.findById(messageId);

        if (msg) {
          const count = msg.reactions.get(emoji) || 0;
          msg.reactions.set(emoji, count + 1);

          await msg.save();
          io.emit("reaction-updated", msg);
        }
      } catch (err) {
        console.error("Error reacting to message:", err);
      }
    }
  );

  socket.on("mark-important", async (id: string) => {
    try {
      const msg = await Message.findByIdAndUpdate(
        id,
        { important: true },
        { new: true }
      );

      io.emit("important-marked", msg);
    } catch (err) {
      console.error("Error marking important:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// -------------------- BOOTSTRAP (IMPORTANT FIX) --------------------

async function startServer() {
  try {
    console.log("Connecting to:", process.env.MONGO_URL);

    await mongoose.connect(process.env.MONGO_URL || "");

    console.log("MongoDB connected");

    // ✅ START CRON ONLY AFTER DB IS READY
    await setupMonthlyBill();
    console.log("Cron started...");

    // START SERVER LAST
    server.listen(PORT, () => {
      console.log(`Socket.IO server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

startServer();