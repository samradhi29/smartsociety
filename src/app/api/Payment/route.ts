import { NextResponse } from "next/server";
import Stripe from "stripe";
import Payment from "@/model/payments";
import { dbconnect } from "@/app/lib/dbconnect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    await dbconnect();
    const { amount, billId, residentId } = await req.json();

    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

   
    await Payment.create({
      billId,
      residentId,
      amount,
      paymentStatus: "pending",
      stripePaymentId: paymentIntent.id,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Error creating payment:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
