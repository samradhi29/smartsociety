// models/MonthlyChargesModel.ts
import mongoose, { Schema, model, models, Document, ObjectId } from 'mongoose';

export interface IMonthlyCharges extends Document {
 society : mongoose.Schema.Types.ObjectId;
  month: string;
  year: number;
  charges: { name: string; amount: number }[];
}

const MonthlyChargesSchema = new Schema<IMonthlyCharges>({
  society : mongoose.Schema.Types.ObjectId,
  month: String,
  year: Number,
  charges: [
    {
      name: String,
      amount: Number
    }
  ]
});

export const MonthlyChargesModel =
  models.MonthlyCharges || model<IMonthlyCharges>('MonthlyCharges', MonthlyChargesSchema);
