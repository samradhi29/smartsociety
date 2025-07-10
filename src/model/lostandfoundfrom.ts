import mongoose, { Schema, Document } from "mongoose";

interface Comment {
  user: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
}

interface ClaimTest {
  user: mongoose.Types.ObjectId;
  answers: string[];
  passed: boolean;
  attemptedAt: Date;
  societyname: string;
  reviewed: boolean;
  verified: boolean | null;
  rejectionReason?: string;
}

interface Penalty {
  reason: string;
  issuedBy: mongoose.Types.ObjectId;
  issuedAt: Date;
}

export interface LostAndFound extends Document {
  title: string;
  description: string;
  typeofobject: "lost" | "found";
  date: Date;
  location: string;
  imageurls?: string[];
  category: string;
  urgent: boolean;
  status: "open" | "pending-review" | "claimed" | "returned" | "fraud-claimed";
  claimTests: ClaimTest[]; // ✅ array of multiple test attempts
  penalty?: Penalty;
  meetingLocation?: string;
  comments: Comment[];
  societyname: string;
}

const lostAndFoundSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    typeofobject: { type: String, enum: ["lost", "found"], required: true },
    date: { type: Date, default: Date.now },
    location: { type: String, required: true },
    imageurls: [{ type: String }],
    category: { type: String, required: true },
    urgent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["open", "pending-review", "claimed", "returned", "fraud-claimed"],
      default: "open",
    },

    claimTests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
        answers: [String],
        passed: Boolean,
        attemptedAt: Date,
        societyname: String,
        reviewed: { type: Boolean, default: false },
        verified: { type: Boolean, default: null },
        rejectionReason: String,
      },
    ],

    penalty: {
      reason: String,
      issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
      issuedAt: Date,
    },

    meetingLocation: { type: String },

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
        text: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    societyname: { type: String, required: true },
  },
  { timestamps: true }
);

export const LostAndFoundModel =
  mongoose.models.LostAndFound ||
  mongoose.model<LostAndFound>("LostAndFound", lostAndFoundSchema);
