"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function MyBills() {
  const { data: session, status } = useSession();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/getbillforflat")
      .then(res => res.json())
      .then(data => {
        setBills(data.bills || []);
        setLoading(false);
      });
  }, []);

  const handlePayment = async (bill: any) => {
    if (!session?.user?.id) return alert("User not logged in!");

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(bill.totalAmount),
        billId: bill._id,
        residentId: session.user.id,
      }),
    });

    const data = await res.json();
    if (!data.clientSecret) return alert("Failed to create payment!");

    window.location.href = `/pay?clientSecret=${data.clientSecret}&billId=${bill._id}&residentId=${session.user.id}`;
  };

  if (status === "loading" || loading) return <p className="text-gray-300">Loading...</p>;
  if (!session?.user) return <p>User not logged in</p>;

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">
      <div className="max-w-2xl mx-auto bg-[#111] p-6 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-white">My Bills</h1>

        {bills.length === 0 && (
          <p className="text-gray-400 text-sm">No pending bills ✨</p>
        )}

        {bills.map(bill => (
          <div
            key={bill._id}
            className="bg-[#1a1a1a] border border-gray-700 p-5 mb-4 rounded-lg shadow-md transition-all hover:border-gray-500"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Month: {bill.month}</p>
                <p className="text-gray-400">Total: ₹{bill.totalAmount}</p>
                <p
                  className={`mt-1 font-medium ${
                    bill.status === "Paid"
                      ? "text-green-500"
                      : bill.status === "Partial"
                      ? "text-yellow-400"
                      : "text-red-500"
                  }`}
                >
                  Status: {bill.status}
                </p>
              </div>

              {bill.status === "Paid" ? (
                <span className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold">
                  Paid
                </span>
              ) : (
                <button
                  onClick={() => handlePayment(bill)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


 

