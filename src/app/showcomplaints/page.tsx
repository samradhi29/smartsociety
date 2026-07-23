"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // ✅ import useSession to access user role

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

export default function ComplaintsDashboard() {
  const { data: session, status } = useSession(); // ✅ get session data
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // ✅ get user role from session
  const userRole = session?.user?.role || "user"; // assume 'role' is stored in session

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

  const getStatusBadge = (status: string) => {
    const styles = {
      resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
      inprogress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const handleUpdate = async (
    id: string,
    newStatus: string,
    note: string | undefined
  ) => {
    try {
      setUpdating(id);
      const res = await fetch("/api/updatecomplaint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, note }),
      });

      if (!res.ok) throw new Error("Failed to update complaint");
      const updated = await res.json();

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...updated } : c))
      );
    } catch (err: any) {
      alert(err.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading complaints...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold mb-2">Complaints Dashboard</h1>
          <p className="text-slate-400">
            {userRole === "admin"
              ? "Admin panel to manage and resolve society complaints."
              : "View complaints related to your society."}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100"
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
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100"
            >
              <option value="all">All Categories</option>
              {[...new Set(complaints.map((c) => c.catagory))].map(
                (cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
            <button
              onClick={() => {
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-4 py-2 text-slate-100"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            No complaints match the selected filters.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((c) => (
              <div
                key={c._id}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
              >
                {/* Complaint Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border font-medium ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status === "inprogress"
                        ? "In Progress"
                        : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">
                      {c.catagory}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Complaint Text */}
                <p className="text-slate-200 mb-4">{c.complaintext}</p>

                {/* Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t border-slate-800 pt-4 mb-4">
                  <Info label="Flat Number" value={c.flatnumber} />
                  <Info
                    label="Created By"
                    value={c.anonymous ? "Anonymous" : c.creatername}
                  />
                  <Info label="Society" value={c.societyname} />
                </div>

                {/* ✅ Only Admin Can Update */}
                {userRole === "admin" && (
                  <div className="border-t border-slate-800 pt-4 mt-4">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">
                      Update Complaint
                    </h3>
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                      <select
                        defaultValue={c.status}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                        onChange={(e) =>
                          setComplaints((prev) =>
                            prev.map((comp) =>
                              comp._id === c._id
                                ? { ...comp, status: e.target.value as any }
                                : comp
                            )
                          )
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Add note (optional)"
                        value={c.note || ""}
                        onChange={(e) =>
                          setComplaints((prev) =>
                            prev.map((comp) =>
                              comp._id === c._id
                                ? { ...comp, note: e.target.value }
                                : comp
                            )
                          )
                        }
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                      />
                      <button
                        disabled={updating === c._id}
                        onClick={() => handleUpdate(c._id, c.status, c.note)}
                        className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                      >
                        {updating === c._id ? "Updating..." : "Save"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Note */}
                {c.note && (
                  <div className="mt-3 text-slate-400 text-sm italic">
                    Note: {c.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs text-slate-500">{label}</div>
    <div className="text-slate-300 font-medium">{value || "N/A"}</div>
  </div>
);
