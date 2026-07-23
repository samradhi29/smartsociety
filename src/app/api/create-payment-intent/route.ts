import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount, billId, residentId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50 * 100, // convert ₹ to paisa
      currency: "inr",
      metadata: { billId, residentId },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
