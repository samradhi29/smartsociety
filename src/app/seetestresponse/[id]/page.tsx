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
  createdBy?: string;
}

export default function GiveTestPage() {
  const { id } = useParams();
  const [responses, setResponses] = useState<ClaimTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock current logged-in user (replace this with your actual auth user)
  // const currentUserEmail = "creator@example.com";

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

 
  const handleAccept = async (index: number) => {
    try {
      const updated = [...responses];
      updated[index].reviewed = true;
      updated[index].verified = true;
      setResponses(updated);

      await fetch(`/api/updatetestresponse/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ responses: updated })
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  
  const handleFake = async (index: number) => {
    const reason = prompt("Enter the reason for rejection:");
    if (!reason) return;

    try {
      const updated = [...responses];
      updated[index].reviewed = true;
      updated[index].verified = false;
      updated[index].rejectionReason = reason;
      setResponses(updated);

      await fetch(`/api/updatetestresponse/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: updated })
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading)
    return <div className="min-h-screen bg-black text-white p-6">Loading...</div>;

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
          className="bg-[#1e1e1e] p-4 rounded-lg shadow-lg border border-gray-700 space-y-3"
        >
          <p><strong>Where lost:</strong> {res.answers[0]}</p>
          <p><strong>When lost:</strong> {res.answers[1]}</p>
          <p><strong>Proof of ownership:</strong> {res.answers[2]}</p>
          <p><em>Society: {res.societyname}</em></p>

          <p>
            <em>Status:{" "}
              {res.reviewed
                ? res.verified
                  ? "Verified"
                  : ` Rejected (${res.rejectionReason || "No reason"})`
                : "Pending Review"}
            </em>
          </p>

          {/* Buttons visible only to the creator */}
          {/* {res.createdBy === currentUserEmail && ( */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleAccept(i)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold"
              >
                Accept
              </button>

              <button
                onClick={() => handleFake(i)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold"
              >
                Fake (Remark)
              </button>
            </div>
          {/* )} */}
        </div>
      ))}
    </div>
  );
}
