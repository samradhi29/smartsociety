'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [ans3, setAns3] = useState('');

  const handleSubmit = async () => {
    if (!id) return alert("Item ID missing.");
    const societyname = session?.user?.society;
    if (!societyname) return alert("Society name missing from session.");

    const res = await fetch('/api/addtestans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ans1,
        ans2,
        ans3,
        societyname,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert("Failed to submit test: " + data.error);
    } else {
      alert("Test submitted successfully!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Is this item really yours? Prove it</h1>

      <label>Where did you lose the item?</label>
      <textarea value={ans1} onChange={(e) => setAns1(e.target.value)} className="w-full mb-4" />

      <label>When did you lose the item?</label>
      <textarea value={ans2} onChange={(e) => setAns2(e.target.value)} className="w-full mb-4" />

      <label>Any unique marks or proof of ownership?</label>
      <textarea value={ans3} onChange={(e) => setAns3(e.target.value)} className="w-full mb-4" />

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Test
      </button>
    </div>
  );
}
