"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Charge {
  name: string;
  amount: number;
}

interface Bill {
  _id: string;
  flatNumber: string;
  month: string;
  year: number;
  charges: Charge[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  dueDate: string;
}

export default function BillsPage() {
  const { data: session, status } = useSession();
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Paid" | "Unpaid" | "Partial">("All");

  useEffect(() => {
    if (!session) return;

    const fetchBills = async () => {
      try {
        const res = await fetch("/api/fetchuserbills");
        const data = await res.json();
        if (data.success) setBills(data.bills);
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [session]);

  // Filter bills when filter changes
  useEffect(() => {
    if (filter === "All") setFilteredBills(bills);
    else setFilteredBills(bills.filter((b) => b.status === filter));
  }, [filter, bills]);

  if (status === "loading" || loading) return <p>Loading bills...</p>;
  if (!session) return <p>Please login to view bills.</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Your Monthly Bills</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {(["All", "Paid", "Unpaid", "Partial"] as const).map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded ${
              filter === f ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
            } transition`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBills.length === 0 ? (
          <p>No bills available.</p>
        ) : (
          filteredBills.map((bill) => (
            <div
              key={bill._id}
              className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">
                  {bill.month} {bill.year}
                </h2>
                <span
                  className={`px-2 py-1 rounded ${
                    bill.status === "Paid"
                      ? "bg-green-600"
                      : bill.status === "Partial"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  } text-sm`}
                >
                  {bill.status}
                </span>
              </div>

              <p className="mb-2">
                <strong>Flat:</strong> {bill.flatNumber}
              </p>

              <div className="mb-2">
                <strong>Charges:</strong>
                <ul className="list-disc list-inside">
                  {bill.charges.map((c) => (
                    <li key={c.name}>
                      {c.name}: ₹{c.amount}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mb-2">
                <strong>Total:</strong> ₹{bill.totalAmount} | <strong>Due:</strong>{" "}
                ₹{bill.dueAmount}
              </p>
              <p className="mb-4">
                <strong>Due Date:</strong>{" "}
                {new Date(bill.dueDate).toLocaleDateString()}
              </p>

              <div className="flex justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
                  onClick={() => alert(`Show/Pay bill ${bill._id}`)}
                >
                  Show / Pay
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
