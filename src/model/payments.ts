import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true,
  },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },
  stripePaymentId: { type: String }, // store Stripe's payment intent ID
  paymentDate: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
