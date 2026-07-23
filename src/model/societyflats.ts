// societyflats.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFlat extends Document {
  flatnumber: string;
  block: string;
  floor: number;
  type: string;
  size: number; 
  isoccupied: boolean;
  society: mongoose.Types.ObjectId; // ObjectId reference
  members?: string[]; // optional array of strings
}

const flatSchema: Schema<IFlat> = new Schema({
  flatnumber: { type: String, required: true },
  block: { type: String, required: true },
  floor: { type: Number, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  isoccupied: { type: Boolean, default: false },
  society: { type: mongoose.Schema.Types.ObjectId, ref: "society", required: true },
  members: [{ type: String }], // array of string
});

// Ensure uniqueness of flatnumber within a society
flatSchema.index({ flatnumber: 1, society: 1 }, { unique: true });

export const societyFlatModel =
  mongoose.models.societyFlat || mongoose.model<IFlat>("societyFlat", flatSchema);
