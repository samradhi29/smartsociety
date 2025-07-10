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
  Building,
  Home,
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
    role: "user",
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
      <Card className="bg-black/40 backdrop-blur-md border border-slate-500 text-white shadow-2xl w-full max-w-3xl shadow-cyan-600">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-green-300 to-pink-300 bg-clip-text text-transparent">
            Register Resident
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-white" />
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="pl-10 bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-white" />
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  className="pl-10 bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-white" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="pl-10 bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-white" />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  required
                  className="pl-10 bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-white" />
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  className="pl-10 bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
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
                className="w-full p-2 rounded bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
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
                className="w-full p-2 rounded bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
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
              <Lock className="absolute left-3 top-3 w-4 h-4 text-white" />
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="pl-10 bg-black text-white border border-neutral-600 focus:outline-none focus:ring-0 focus:bg-black"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-2 mt-4 bg-black border-2 text-yellow-300 hover:from-blue-600 hover:to-purple-800 rounded-xl border-b-gray-950"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
