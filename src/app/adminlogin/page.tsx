"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
} from "lucide-react";

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
    society: "",
    password: "",
    role: "admin",
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
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <Card className="bg-gradient-to-r from-black to-zinc-950 backdrop-blur-sm border border-zinc-700 text-white shadow-2xl w-full max-w-3xl rounded-xl">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-green-300 to-pink-300 bg-clip-text text-transparent">
            Register Admin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="pl-10 bg-gradient-r from-black to-zinc-500 border border-zinc-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  className="pl-10 bg-gradient-r from-black to-zinc-900 border border-zinc-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="pl-10 bg-gradient-to-br from-black to-zinc-900 border-zinc-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  required
                  className="pl-10 bg-gradient-to-br from-black to-zinc-900 border border-zinc-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gradient-to-br from-black to-zinc-900 text-white border border-zinc-600 focus:outline-none"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  className="pl-10 bg-gradient-to-br from-black to-zinc-900 border border-zinc-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="society"
                value={formData.society}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gradient-to-br from-black to-zinc-900 text-white border border-zinc-600 focus:outline-none"
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
                className="w-full p-2 rounded bg-gradient-to-br from-black to-zinc-900 text-white border border-zinc-600 focus:outline-none"
              >
                <option value="">Select Flat</option>
                {flats.map((flat) => (
                  <option key={flat._id} value={flat._id}>
                    {flat.flatnumber} - Block {flat.block}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="pl-10 bg-gradient-to-br from-black to-zinc-900 border border-zinc-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-2 mt-2 bg-black font-semibold rounded-lg hover:brightness-110 transition duration-200 border-b-emerald-300 border-2"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
