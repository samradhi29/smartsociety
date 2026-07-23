import { NextResponse } from "next/server";
import Stripe from "stripe";
import { dbconnect } from "@/app/lib/dbconnect";
import { BillModel } from "@/model/maintainancebill";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST(req: Request) {
  try {
    const { billId } = await req.json();

    await dbconnect();
    const bill = await BillModel.findById(billId);

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Maintenance Bill - ${bill.month} ${bill.year}`,
              description: `Flat: ${bill.flat}`,
            },
            unit_amount: bill.totalAmount * 100, // Stripe uses paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment-failed`,
      metadata: { billId: bill._id.toString() },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
