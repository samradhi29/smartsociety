"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function FlatsUploadPage() {
  const [societies, setSocieties] = useState<{ _id: string; name: string }[]>([]);
  const [selectedSociety, setSelectedSociety] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
const Router = useRouter();
  // Fetch societies
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await fetch("/api/societies");
        const data = await res.json();

        if (data.societies && Array.isArray(data.societies)) {
          setSocieties(data.societies);
        } else {
          setMessage("No societies found.");
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch societies.");
      } finally {
        setFetching(false);
      }
    };

    fetchSocieties();
  }, []);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedSociety || !file) {
      setMessage("⚠️ Please select a society and choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("society", selectedSociety); // ✅ sends name now

    setLoading(true);
    try {
      const res = await fetch("/api/uploadflats", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message || "Upload successful!"}`);
        setFile(null);
        setSelectedSociety("");
        Router.push("/adminlogin");
      } else {
        setMessage(`❌ ${data.message || "Upload failed."}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">📂 Upload Flats Excel File</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-6 border rounded-2xl shadow-lg w-full max-w-md bg-white"
      >
        {/* Society Dropdown */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">
            Select Society
          </label>
          {fetching ? (
            <p className="text-sm text-gray-500">Loading societies...</p>
          ) : (
            <select
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">-- Select Society --</option>
              {societies.map((society) => (
                <option key={society._id} value={society.name}>
                  {society.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">
            Upload Excel File
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border border-gray-300 p-2 rounded-md w-full cursor-pointer focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {file && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading && <Loader2 className="animate-spin mr-2" size={18} />}
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
