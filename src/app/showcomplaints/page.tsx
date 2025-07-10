"use client";

import React, { useEffect, useState } from "react";

interface Complaint {
  societyname: string;
  creatername: string;
  complaintext: string;
  catagory: string;
  status: "inprogress" | "pending" | "resolved" | "rejected";
  flatnumber: string;
  createdAt: string;
  anonymous: boolean;
}

export default function Page() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch("/api/fetchcomplaints");
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const data = await res.json();
        setComplaints(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const statusMatches =
      statusFilter === "all" || complaint.status === statusFilter;
    const categoryMatches =
      categoryFilter === "all" || complaint.catagory === categoryFilter;
    return statusMatches && categoryMatches;
  });

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Complaints</h1>

      {/* Filter UI */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Categories</option>
          {[...new Set(complaints.map((c) => c.catagory))].map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          className="px-4 py-2 bg-gray-200 rounded text-sm"
          onClick={() => {
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <p>No complaints match the selected filters.</p>
      ) : (
        filteredComplaints.map((complaint, index) => (
          <div
            key={index}
            className="mb-4 p-4 border rounded shadow-md bg-white text-black"
          >
            <p>
              <strong>Category:</strong> {complaint.catagory || "N/A"}
            </p>
            <p>
              <strong>Complaint:</strong> {complaint.complaintext}
            </p>
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
            <p>
              <strong>Flat Number:</strong> {complaint.flatnumber || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Created By:</strong>{" "}
              {complaint.anonymous ? "Anonymous" : complaint.creatername}
            </p>
            <p>
              <strong>Society:</strong> {complaint.societyname || "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
