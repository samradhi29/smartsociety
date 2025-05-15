"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface Flat {
  _id: string;
  flatnumber: string;
  block: string;
}

interface Society {
  _id: string;
  name: string;
  location: string;
}

export default function RegisterResident() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "Male",
    age: "",
    flatnumber: "",
    society: "", // <-- new field
    password: "",
  });

  const [flats, setFlats] = useState<Flat[]>([]);
  const [societies, setSocieties] = useState<Society[]>([]);

  useEffect(() => {
    const fetchFlatsAndSocieties = async () => {
      try {
        const [flatsRes, societiesRes] = await Promise.all([
          fetch("/api/flats"),
          fetch("/api/societies"),
        ]);

        const flatsData = await flatsRes.json();
        const societiesData = await societiesRes.json();

        setFlats(flatsData.flats || []);
        setSocieties(societiesData.societies || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFlatsAndSocieties();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.flatnumber || !formData.society) {
      alert("Please select a flat and a society.");
      return;
    }

    try {
      const res = await fetch("/api/userregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      alert(result.message);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-black to-purple-900 px-4">
      <form onSubmit={handleSubmit} className="bg-black/70 p-8 rounded-xl text-white w-full max-w-xl space-y-6 border border-purple-500">
        <h2 className="text-2xl font-bold text-center">Register Resident</h2>

        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-2 rounded bg-black/40 border border-purple-400" />
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full p-2 rounded bg-black/40 border border-purple-400" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 rounded bg-black/40 border border-purple-400" />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 rounded bg-black/40 border border-purple-400" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 rounded bg-black/40 border border-purple-400">
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required className="w-full p-2 rounded bg-black/40 border border-purple-400" />

        {/* Society dropdown */}
        <select name="society" value={formData.society} onChange={handleChange} required className="w-full p-2 rounded bg-black/40 border border-purple-400">
          <option value="">Select Society</option>
          {societies.map((soc) => (
            <option key={soc._id} value={soc._id}>
              {soc.name} - {soc.location}
            </option>
          ))}
        </select>

        {/* Flat dropdown */}
        <select name="flatnumber" value={formData.flatnumber} onChange={handleChange} required className="w-full p-2 rounded bg-black/40 border border-purple-400">
          <option value="">Select Flat</option>
          {flats.map((flat) => (
            <option key={flat._id} value={flat._id}>
              {flat.flatnumber} - Block {flat.block}
            </option>
          ))}
        </select>

        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-2 rounded bg-black/40 border border-purple-400" />

        <button type="submit" className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl font-semibold">
          Register
        </button>
      </form>
    </div>
  );
}
