import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFlat extends Document {
  flatnumber: string;
  block: string;
  floor: number;
  type: string;
  size: number;
  isoccupied: boolean;
  society: Types.ObjectId;  // <-- ObjectId for ref
}

const flatsSchema: Schema<IFlat> = new Schema({
  flatnumber: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  isoccupied: {
    type: Boolean,
    default: false,
  },
  society: {
    type: mongoose.Schema.Types.ObjectId, // <-- Use ObjectId here
    ref: "Society",
    required: true,
  },
});

export const flatsModel =
  mongoose.models.flats || mongoose.model<IFlat>("flats", flatsSchema);
