"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Info, X } from "lucide-react"; // 👈 Lucide icons

export default function UploadFlatsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const societyname = localStorage.getItem("societyname");
    if (!societyname) {
      alert("Society name not found. Please register society first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("societyname", societyname);

    const res = await fetch("api/uploadflats", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    alert(result.message);

    if (res.ok) {
      router.push("/adminlogin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-slate-900 px-4 py-12 flex items-center justify-center relative">
      
      {/* Alert Popup */}
      {showAlert && (
        <div className="absolute top-6 right-6 bg-yellow-50 text-yellow-800 border border-yellow-300 rounded-lg shadow-md p-4 w-full max-w-md flex items-start justify-between gap-3">
          <div className="flex gap-2 items-start">
            <Info className="w-6 h-6 mt-0.5 text-yellow-600" />
            <p className="text-sm leading-tight">
              Please upload an Excel file with flat details like <strong>flat number</strong>, <strong>owner name</strong>, etc.
            </p>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Card */}
      <Card className="w-full max-w-6xl bg-black border border-slate-600 shadow-cyan-500 text-white rounded-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <CardHeader className="p-0">
            <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-cyan-400 to-yellow-400  bg-clip-text text-transparent">
              Upload Flats (Excel)
            </CardTitle>
          </CardHeader>

          {/* Instruction Message */}
          <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-sm mt-3">
            <AlertCircle className="w-5 h-5 text-amber-500   animate-pulse" />
            <p>Follow the instructions properly before uploading</p>
          </div>

          <CardContent className="mt-6 p-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm text-slate-500 font-medium">
                  Select Excel File (.xls / .xlsx)
                </label>
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="bg-black border border-slate-700 text-white file:bg-gray-800 file:text-white file:rounded-md file:border-none file:font-medium file:px-4 file:py-2 hover:file:brightness-110"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-white text-black font-semibold rounded-xl py-2 px-6 shadow-md hover:bg-black hover:text-white border border-slate-200 transition duration-300"
                >
                  Upload
                </Button>
              </div>
            </form>
          </CardContent>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-slate-800 via-black to-gray-800 p-6">
          <img
            src="/society2.jpg" // ✅ Replace with your own image
            alt="Upload Flats Illustration"
            className="max-w-md rounded-xl shadow-xl"
          />
        </div>
      </Card>
    </div>
  );
}
