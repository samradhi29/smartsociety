'use client';

import { useEffect, useState } from 'react';

export default function MyBillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBills() {
      try {
        const res = await fetch('/api/getbillforflat');
        const data = await res.json();
        console.log("Fetched bills:", data); // Debug log

        // Ensure bills is always an array
        setBills(Array.isArray(data.bills) ? data.bills : []);
      } catch (error) {
        console.error('Error fetching bills:', error);
        setBills([]); // fallback to empty array on error
      } finally {
        setLoading(false);
      }
    }

    fetchBills();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧾 My Maintenance Bills</h1>

      {loading ? (
        <p>Loading bills...</p>
      ) : bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <ul className="space-y-4">
          {bills.map((bill: any) => (
            <li key={bill._id} className="border rounded p-4 shadow-sm">
              <p><b>Flat:</b> {bill.flatNumber}</p>
              <p><b>Month:</b> {bill.month} {bill.year}</p>
              <p><b>Total:</b> ₹{bill.totalAmount}</p>
              <p>
                <b>Status:</b>{' '}
                <span className={bill.status === 'Paid' ? 'text-green-600' : 'text-red-600'}>
                  {bill.status}
                </span>
              </p>
              {bill.paymentDate && (
                <p><b>Paid On:</b> {new Date(bill.paymentDate).toLocaleString()}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
