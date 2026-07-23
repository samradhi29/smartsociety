'use client';

import { useState } from 'react';

interface Charge {
  name: string;
  amount: number;
}

export default function SetMonthlyChargesPage() {
  const [month, setMonth] = useState(() => new Date().toLocaleString('default', { month: 'long' }));
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [charges, setCharges] = useState<Charge[]>([{ name: '', amount: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

const handleChargeChange = (index: number, field: keyof Charge, value: string | number) => {
  const updated = [...charges];

  if (field === 'amount') {
    updated[index].amount = Number(value);
  } else if (field === 'name') {
    updated[index].name = String(value);
  }

  setCharges(updated);
};


  const addChargeRow = () => setCharges([...charges, { name: '', amount: 0 }]);

  const validateForm = () => {
    if (!month || !year) return 'Month and year are required.';
    for (const charge of charges) {
      if (!charge.name.trim()) return 'Charge name cannot be empty.';
      if (charge.amount <= 0) return 'Charge amount must be greater than 0.';
    }
    return '';
  };

  const handleSubmit = async () => {
    setMessage('');
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/adminsetcharges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year, charges }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit charges');

      setMessage(data.message);
      setCharges([{ name: '', amount: 0 }]); // reset
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-6">Set Monthly Maintenance Charges</h1>

      {/* Month Input */}
      <input
        type="text"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        placeholder="Month (e.g., July)"
        className="w-full border p-2 rounded mb-4"
      />

      {/* Year Input */}
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Charges */}
      <div className="space-y-3">
        <h2 className="font-medium mb-2">Charges</h2>
        {charges.map((charge, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input
              type="text"
              value={charge.name}
              onChange={(e) => handleChargeChange(index, 'name', e.target.value)}
              placeholder="Charge name"
              className="flex-1 border p-2 rounded"
            />
            <input
              type="number"
              value={charge.amount}
              onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              className="w-32 border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addChargeRow}
          className="text-blue-600 hover:underline text-sm"
        >
          + Add another charge
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {isLoading ? 'Submitting...' : 'Submit Charges'}
      </button>

      {/* Feedback */}
      {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
    </div>
  );
}
