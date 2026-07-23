"use client";

import React, { useEffect, useState } from "react";

interface Complaint {
  _id: string;
  societyname: string;
  creatername: string;
  complaintext: string;
  catagory: string;
  status: "inprogress" | "pending" | "resolved" | "rejected";
  flatnumber: string;
  createdAt: string;
  anonymous: boolean;
  note?: string;
}

export default function Page() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [originalComplaints, setOriginalComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch("/api/fetchcomplaints");
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const data = await res.json();
        setComplaints(data.complaints || data);
        setOriginalComplaints(data.complaints || data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: Complaint["status"],
    note: string
  ) => {
    if (!note.trim()) {
      alert("Note cannot be empty.");
      return;
    }

    try {
      const res = await fetch("/api/updatecomplaint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, note }),
      });
      if (!res.ok) throw new Error("Failed to update complaint");

      const updated = complaints.map((c) =>
        c._id === id ? { ...c, status, note } : c
      );
      setComplaints(updated);
      setOriginalComplaints(updated);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update complaint");
    }
  };

  const hasChanged = (id: string, current: Complaint) => {
    const original = originalComplaints.find((c) => c._id === id);
    return (
      original?.status !== current.status ||
      (original?.note || "").trim() !== (current?.note || "").trim()
    );
  };

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Complaints Overview</h1>

      {complaints.length === 0 && <p>No complaints found.</p>}

      {complaints.map((complaint) => (
        <div
          key={complaint._id}
          className="mb-6 p-4 border rounded shadow-md bg-white text-black"
        >
          <p><strong>Category:</strong> {complaint.catagory || "N/A"}</p>
          <p><strong>Complaint:</strong> {complaint.complaintext}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                complaint.status === "resolved"
                  ? "text-green-600"
                  : complaint.status === "pending"
                  ? "text-yellow-600"
                  : complaint.status === "rejected"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {complaint.status}
            </span>
          </p>
          <p><strong>Note:</strong> {complaint.note || "No note"}</p>
          <p><strong>Flat Number:</strong> {complaint.flatnumber || "N/A"}</p>
          <p><strong>Created At:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
          <p><strong>Created By:</strong> {complaint.anonymous ? "Anonymous" : complaint.creatername}</p>
          <p><strong>Society:</strong> {complaint.societyname || "N/A"}</p>

          {/* Always show update controls */}
          <div className="mt-4 border-t pt-4">
            <label className="block mb-1 font-medium">Change Status:</label>
            <select
              value={complaint.status}
              onChange={(e) => {
                const updated = complaints.map((c) =>
                  c._id === complaint._id
                    ? { ...c, status: e.target.value as Complaint["status"] }
                    : c
                );
                setComplaints(updated);
              }}
              className="border p-2 rounded w-full mb-3"
            >
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <label className="block mb-1 font-medium">Note:</label>
            <textarea
              placeholder="Add note..."
              className="block w-full border p-2 rounded"
              value={complaint.note || ""}
              onChange={(e) => {
                const updated = complaints.map((c) =>
                  c._id === complaint._id
                    ? { ...c, note: e.target.value }
                    : c
                );
                setComplaints(updated);
              }}
            />

            <button
              onClick={() =>
                handleStatusChange(
                  complaint._id,
                  complaint.status,
                  complaint.note || ""
                )
              }
              className="mt-3 px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              disabled={
                !hasChanged(complaint._id, complaint) ||
                !(complaint.note && complaint.note.trim())
              }
            >
              Save Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
