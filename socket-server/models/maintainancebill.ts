import mongoose, { Schema, model, models, Document } from "mongoose";

interface Charge {
  name: string;
  amount: number;
}

export interface IBill extends Document {
  flat: mongoose.Types.ObjectId; // Reference to Flat
  society: mongoose.Types.ObjectId; // Reference to Society
  month: string;
  year: number;
  charges: Charge[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "Paid" | "Unpaid" | "Partial";
  paidBy?: mongoose.Types.ObjectId; // Reference to Resident/User
  dueDate: Date;
  paymentDate?: Date;
}

const BillSchema = new Schema<IBill>(
  {
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "societyFlat", required: true },
    society: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    charges: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number },
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Partial"],
      default: "Unpaid",
    },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
    dueDate: { type: Date },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

export const BillModel = models.Bill || model<IBill>("Bill", BillSchema);
