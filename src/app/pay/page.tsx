"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function PayContent() {
  const searchParams = useSearchParams();

  const clientSecret = searchParams.get("clientSecret");
  const billId = searchParams.get("billId") || "";
  const residentId = searchParams.get("residentId") || "";

  if (!clientSecret) {
    return <p>Loading Payment...</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        Complete Your Payment
      </h2>

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm
          billId={billId}
          residentId={residentId}
        />
      </Elements>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<p>Loading Payment...</p>}>
      <PayContent />
    </Suspense>
  );
}