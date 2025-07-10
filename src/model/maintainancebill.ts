import mongoose, { Schema, model, models, Document } from 'mongoose';

// TypeScript Interface for Bill

// models/BillModel.ts
interface Charge {
  name: string;
  amount: number;
}

export interface IBill extends Document {
  flatNumber: string;
   residentId: mongoose.Types.ObjectId;
  month: string;
  year: number;
  charges: Charge[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
  dueDate: Date;
  paymentDate?: Date;
}

const BillSchema = new Schema<IBill>({
  flatNumber: { type: String, required: true },
  // residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  month: { type: String },
  year: { type: Number },
  charges: [
    {
      name: String,
      amount: Number,
    },
  ],
  totalAmount: Number,
  paidAmount: { type: Number, default: 0 },
  dueAmount: Number,
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid',
  },
  dueDate: Date,
  paymentDate: Date,
});

export const BillModel = models.Bill || model<IBill>('Bill', BillSchema);