import React, { useEffect, useState } from 'react';

export default function Page() {
  const [bill, setBill] = useState(null); // use null or [] depending on data structure

  const fetchBills = async () => {
    try {
      const res = await fetch("/app/api/billhistory");
      const data = await res.json();
      setBill(data);
    } catch (error) {
      console.error("Error fetching bill history:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div>
      <h2>Bill History</h2>
      {bill ? (
        <pre>{JSON.stringify(bill, null, 2)}</pre> // Temporary way to display data
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
