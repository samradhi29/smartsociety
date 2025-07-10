import mongoose, { Schema, Document  , Types } from "mongoose";
import {  Society } from "./Society";
import { flatsModel } from "./flats";
export interface Resident extends Document {
  name: string;
  email: string;
   flatnumber: mongoose.Types.ObjectId;
  phone: string;
  gender: string;
  age: number;
  username : string;
  society : Types.ObjectId;
  password : string;
  role : string;
}

const residentSchema: Schema<Resident> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"]
  },
  flatnumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "flats",
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "society",
    required: true
  }
});


export const ResidentModel =
  mongoose.models.Resident || mongoose.model<Resident>("Resident", residentSchema);
