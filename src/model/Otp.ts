import mongoose, { Schema, models, model } from "mongoose";

const OTPSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { 
    type: Date, 
    default: () => Date.now() + 5 * 60 * 1000,  // 5 minutes from now
    expires: 0  // TTL index to expire at 'expiresAt' time
  },
});


export const OTPModel = models.OTP || model("OTP", OTPSchema);
