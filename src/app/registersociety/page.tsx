"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ← Make sure it's from 'next/navigation'

export default function Page() {
  const [societyname, setsocietyname] = useState("");
  const [address, setaddress] = useState("");
  const [admin, setadmin] = useState("");
  const [password, setpassword] = useState("");
  const router = useRouter(); // ← For programmatic navigation

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form from refreshing the page

    const res = await fetch("/api/society", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: societyname,
        address: address,
        email: admin,
        password: password,
      }),
    });

    if (res.ok) {
      // ✅ Redirect to frontend /flats page after successful registration
      router.push("/flats");
    } else {
      const data = await res.json();
      alert(data.message || "Failed to register society.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-black p-10">
      <div className="bg-black text-white rounded-xl border border-purple-400 shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 shadow-lg">
          Register Your Society
        </h1>
        <form onSubmit={handlesubmit} className="space-y-4 ">
          <div>
            <label className="block text-white font-semibold mb-1">Society Name</label>
            <input onChange={(e)=>setsocietyname(e.target.value)}
              type="text" 
              value={societyname}
              placeholder="Enter society name"
              className="w-full bg-black text-white border border-purple-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-1 ">Location</label>
            <input
              type="text" 
              value={address}
              onChange={(e)=>setaddress(e.target.value)}
              placeholder="Enter location"
              className="w-full bg-black text-white border border-purple-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-1">Admin Email</label>
            <input
              type="email"
              value={admin}
              onChange={(e)=>setadmin(e.target.value)}
              placeholder="Enter email"
              className="w-full bg-black text-white border border-purple-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-1">Password</label>
            <input
            value={password}
            onChange={(e)=>setpassword(e.target.value)}
              type="password"
              placeholder="Create password"
              className="w-full bg-black text-white border border-purple-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
          
            className="w-full bg-purple-600 text-white font-bold py-2 rounded-xl shadow-md shadow-purple-500/50 hover:bg-purple-500 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
