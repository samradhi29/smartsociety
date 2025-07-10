// models/MonthlyChargesModel.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IMonthlyCharges extends Document {
  month: string;
  year: number;
  charges: { name: string; amount: number }[];
}

const MonthlyChargesSchema = new Schema<IMonthlyCharges>({
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
