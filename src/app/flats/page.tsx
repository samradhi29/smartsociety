"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadFlatsPage() {
  const [file, setFile] = useState<File | null>(null);
const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-flats", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    alert(result.message);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-black to-purple-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6 border border-purple-500"
      >
        <h2 className="text-white text-2xl font-bold text-center">Upload Flats Excel</h2>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
          file:bg-purple-600 file:text-white hover:file:bg-purple-700 bg-black/40 p-2 rounded-md"
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-xl font-semibold shadow-md"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
