import mongoose from "mongoose";

const meetingReportSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  report: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MeetingReport =
  mongoose.models.MeetingReport ||
  mongoose.model("MeetingReport", meetingReportSchema);

export default MeetingReport;