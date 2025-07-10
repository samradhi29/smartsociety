'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ClaimTest {
  answers: string[];
  passed: boolean;
  attemptedAt: string;
  societyname: string;
  reviewed: boolean;
  verified: boolean | null;
  rejectionReason?: string;
}

export default function GiveTestPage() {
  const { id } = useParams();
  const [responses, setResponses] = useState<ClaimTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/gettestdata/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setResponses(data);
      } catch (error) {
        console.error(error);
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black text-white p-6">Loading...</div>;

  if (responses.length === 0)
    return (
      <div className="min-h-screen bg-black text-white p-6 text-center">
        No test responses found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center border-b border-gray-700 pb-2">
        All Test Responses
      </h1>

      {responses.map((res, i) => (
        <div
          key={i}
          className="bg-[#1e1e1e] p-4 rounded-lg shadow-lg border border-gray-700"
        >
          <p><strong>Where lost:</strong> {res.answers[0]}</p>
          <p><strong>When lost:</strong> {res.answers[1]}</p>
          <p><strong>Proof of ownership:</strong> {res.answers[2]}</p>
          <p><em>Status: {res.reviewed ? (res.verified ? "Verified" : "Rejected") : "Pending Review"}</em></p>
        </div>
      ))}
    </div>
  );
}
