"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface Society {
  _id: string;
  name: string;
  location: string;
}

interface Flat {
  _id: string;
  flatnumber: string;
  block: string;
  floor: number;
}

export default function RegisterResident() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "Male",
    age: "",
    society: "",
    flatnumber: "",
    password: "",
    role: "admin",
  });

  const [societies, setSocieties] = useState<Society[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const router = useRouter();

  // Fetch societies
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await fetch("/api/societies");
        if (!res.ok) {
          console.error("Failed to fetch societies:", await res.text());
          setSocieties([]);
          return;
        }
        const data = await res.json();
        setSocieties(data.societies || []);
      } catch (error) {
        console.error("Error fetching societies:", error);
        setSocieties([]);
      }
    };
    fetchSocieties();
  }, []);

  // Fetch flats when society changes
  useEffect(() => {
    const fetchFlats = async () => {
      if (!formData.society) {
        setFlats([]);
        return;
      }

      try {
        const res = await fetch(`/api/flats/${formData.society}`);

        if (!res.ok) {
          const text = await res.text();
          console.error("Fetch failed:", text);
          setFlats([]);
          return;
        }

        const data = await res.json();
        if (!data.flats || data.flats.length === 0) {
          console.warn("No flats found for this society.");
          setFlats([]);
        } else {
          setFlats(data.flats);
        }
      } catch (error) {
        console.error("Error fetching flats:", error);
        setFlats([]);
      }
    };

    fetchFlats();
  }, [formData.society]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.society || !formData.flatnumber) {
      alert("Please select a society and flat.");
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
      router.push("/flats");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <Card className="bg-gradient-to-r from-black to-zinc-950 backdrop-blur-sm border border-zinc-700 text-white shadow-2xl w-full max-w-3xl rounded-xl">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-green-300 to-pink-300 bg-clip-text text-transparent">
            Register Admin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
              <Input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-2 rounded bg-zinc-900 text-white border border-zinc-700"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <Input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
            </div>

            {/* Society & Flat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="society"
                value={formData.society}
                onChange={handleChange}
                required
                className="p-2 rounded bg-zinc-900 text-white border border-zinc-700"
              >
                <option value="">Select Society</option>
                {societies.map((soc) => (
                  <option key={soc._id} value={soc._id}>
                    {soc.name} - {soc.location}
                  </option>
                ))}
              </select>

              <select
                name="flatnumber"
                value={formData.flatnumber}
                onChange={handleChange}
                required
                className="p-2 rounded bg-zinc-900 text-white border border-zinc-700"
              >
                <option value="">Select Flat</option>
                {flats.length === 0 && <option value="">No flats available</option>}
                {flats.map((flat) => (
                  <option key={flat._id} value={flat._id}>
                    {flat.flatnumber} (Block {flat.block}, Floor {flat.floor})
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />

            <Button type="submit" className="w-full py-2 bg-black border-emerald-300 border-2">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
