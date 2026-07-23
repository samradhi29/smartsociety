import { NextResponse } from "next/server";
import { buffer } from "micro";
import Stripe from "stripe";
import { dbconnect } from "@/app/lib/dbconnect";
import { BillModel } from "@/model/maintainancebill";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 
});

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature")!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const billId = session.metadata?.billId;

    if (billId) {
      await dbconnect();
      await BillModel.findByIdAndUpdate(billId, {
        status: "Paid",
        paidAmount: (session.amount_total ?? 0) / 100,
        paymentDate: new Date(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
