'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Visitor {
  _id: string;
  name: string;
  flat: string;
  purpose: string;
  inTime?: string;
  outTime?: string;
}

export default function VisitorHistoryPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchVisitors() {
      if (!session?.user?.society) return;

      try {
        const res = await fetch(`/api/visitorhistory?societyname=${session.user.society}`);
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setVisitors(data.visitors || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchVisitors();
  }, [session]);

  if (loading) return <p className="text-white">Loading visitor history...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Visitor History</h1>
      {visitors.length === 0 ? (
        <p>No visitor entries found.</p>
      ) : (
        <ul className="space-y-4">
          {visitors.map((vis) => (
            <li key={vis._id} className="p-4 bg-gray-800 rounded-lg shadow-md">
              <p><strong>Name:</strong> {vis.name}</p>
              <p><strong>Flat:</strong> {vis.flat}</p>
              <p><strong>Purpose:</strong> {vis.purpose}</p>
              <p><strong>In Time:</strong> {vis.inTime ? new Date(vis.inTime).toLocaleString() : 'N/A'}</p>
              <p><strong>Out Time:</strong> {vis.outTime ? new Date(vis.outTime).toLocaleString() : 'Still inside'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
