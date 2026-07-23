"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const billId = searchParams.get("billId");
  const residentId = searchParams.get("residentId");
  const router = useRouter();

  useEffect(() => {
    if (!billId || !residentId) return;

    async function markPaid() {
      try {
        const res = await fetch("/api/mark-bill-paid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            billId,
            residentId,
          }),
        });

        const data = await res.json();
        console.log("Bill updated:", data);
      } catch (err) {
        console.error("Failed to mark bill as paid:", err);
      }
    }

    markPaid();
  }, [billId, residentId]);

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>

      <p className="mt-2 mb-6">
        Your bill has been paid successfully.
      </p>

      <button
        onClick={goToDashboard}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}