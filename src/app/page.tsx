"use client";

import { User, LogIn, Megaphone, HelpCircle, Calendar, Wrench, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="bg-black min-h-screen text-white">
        {/* Navbar */}
        <div className="flex justify-between items-center px-6 py-4">
          <h4 className="text-xl  text-white">Socitopia</h4>
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button variant="default" className="border-white text-white hover:bg-white hover:text-black transition">
                <LogIn size={16} className="mr-1" />
                Login
              </Button>
            </Link>
            <Link href="/registersociety">
              <Button variant="default" className="border-white text-white hover:bg-white hover:text-black transition">
                <User size={16} className="mr-1" />
                Register Society
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-4 text-center mt-10">
          <div className="flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-gray-700 shadow-md">
            <span className="px-3 py-1 text-sm font-medium bg-emerald-500 text-black rounded-full">
              Add Society
            </span>
            <span className="text-sm text-blue-400 font-medium">Organize your society</span>
          </div>

          <h1 className="text-2xl sm:text-6xl font-stretch-expanded text-white mb-2">Forget Notices on Doors.</h1>
          <h1 className="text-2xl sm:text-6xl font-stretch-ultra-expanded bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Get Real-Time Updates
          </h1>

          <p className="mt-6 text-gray-400 text-base sm:text-lg max-w-md">Digitize your community life.</p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto p-6 mt-10">
          {["/img2.jpg", "/unnamed.jpg", "/societymanagement.jpg", "/society2.jpg"].map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl shadow-lg">
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Orbiting Image */}
        <img
          alt="orbiting element"
          className="mx-auto w-1/2 mt-8 animate-pulse"
          src="/assets/2-CJcXsF6v.webp"
        />

        {/* Moving Cards Section */}
        <div className=" text-center mt-16 mb-4 text-2xl font-stretch-ultra-expanded text-amber-100">
          What Do We Have?
        </div>

        <div className="overflow-hidden whitespace-nowrap">
          <div className="flex gap-6 px-6 animate-marquee">
            {[
              { icon: <Megaphone />, title: "Complaint Box", quote: "Raise issues easily" },
              { icon: <Users />, title: "Visitor Login", quote: "Track guest entries" },
              { icon: <Calendar />, title: "Event Management", quote: "Stay updated" },
              { icon: <HelpCircle />, title: "Lost & Found", quote: "Claim or report items" },
              { icon: <Wrench />, title: "Maintenance", quote: "Track repairs" },
              { icon: <Calendar />, title: "Meeting Room", quote: "Book space for events" },
            ].map((item, index) => (
              <div
                key={index}
                className="min-w-[200px] bg-black border-2 border-gray-500 shadow-blue-400 text-white p-4 rounded-xl shadow-md backdrop-blur-sm hover:scale-105 transition-transform"
              >
                <div className="mb-2">{item.icon}</div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.quote}</p>
              </div>
            ))}
          </div>
        </div>

{/* What Makes Us Different Section */}
<div className="bg-black text-white py-16 px-4 sm:px-8">
  <h2 className="text-amber-100 text-3xl sm:text-4xl font-stretch-ultra-expanded text-center mb-12">
    What Makes Us Different?
  </h2>

  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
    {[
      { title: "Role-Based Access", desc: "Admins and residents have personalized control." },
      { title: "Emergency Alerts", desc: "Alert guards, notify members instantly in crises." },
      { title: "Real-Time Visitor Logs", desc: "Track guest entries with instant updates." },
      { title: "Lost & Found", desc: "Report and retrieve lost items with proof-based validation." },
      { title: "Maintenance Management", desc: "Assign, track, and resolve complaints quickly." },
      { title: "Group Chat & Events", desc: "Coordinate event details with residents seamlessly." },
      { title: "Gym & Parking Booking", desc: "Reserve amenities without manual tracking." },
      { title: "Urgent Meeting Notices", desc: "No WhatsApp chaos — notify residents directly." },
      { title: "Smart Complaint Box", desc: "Transparent issue tracking with status updates." },
    ].map((item, idx) => (
      <div
        key={idx}
        className="bg-gradient-to-bl from-black to-zinc-900 rounded-2xl p-6 shadow-md hover:shadow-xl backdrop-blur-sm transition-all"
      >
        <h3 className="text-xl font-semibold mb-2 text-blue-300">{item.title}</h3>
        <p className="text-gray-300 text-sm">{item.desc}</p>
      </div>
    ))}
  </div>
</div>


{/* Footer */}
<footer className="bg-black text-white py-8 px-6 mt-10 border-2 border-gray-600">
  <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
    <div>
      <h3 className="text-xl font-stretch-expanded text-blue">Socitopia</h3>
      <p className="text-sm text-gray-400 mt-1">Bringing societies closer, digitally.</p>
    </div>

    <div className="flex gap-4 text-sm text-gray-400">
      <Link href="/about">About</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/contact">Contact</Link>
    </div>

    <div className="text-sm text-gray-500">
      © {new Date().getFullYear()} Socitopia. All rights reserved.
    </div>
  </div>
</footer>


      </div>
    </>
  );
}
