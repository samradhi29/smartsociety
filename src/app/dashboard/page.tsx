import React from "react";
import {
  Home,
  Building2,
  AlertCircle,
  Users,
  Search,
  LogIn,
  Dumbbell,
  Car,
  Calendar,
  AlarmClock,
} from "lucide-react";

export default function Page() {
  return (
    <div className="w-screen h-screen bg-gradient-to-l from-black to-purple-900 flex flex-col">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4">
        {/* logo.png must be in /public */}
        <img src="/logo.png" alt="Sociopia logo" className="h-12 w-auto" />
        
        {/* Heading with design */}
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 shadow-lg">
          Sociopia
        </h1>
      </header>

      {/* ── Main section: sidebar + (future) content ───────── */}
      <main className="flex flex-1">
        {/* Sidebar */}
        <div className="h-full w-52 p-4 bg-black border border-purple-600 rounded-xl shadow-xl space-y-4">
          {[  
            { icon: <Home className="text-purple-400" />, label: "Society Details" },
            { icon: <Building2 className="text-purple-400" />, label: "Flat Details" },
            { icon: <AlertCircle className="text-purple-400" />, label: "Complaint Box" },
            { icon: <Users className="text-purple-400" />, label: "Meeting Room" },
            { icon: <Search className="text-purple-400" />, label: "Lost and Found" },
            { icon: <LogIn className="text-purple-400" />, label: "Visitor Login" },
            { icon: <Dumbbell className="text-purple-400" />, label: "Gym" },
            { icon: <Car className="text-purple-400" />, label: "Parking" },
            { icon: <Calendar className="text-purple-400" />, label: "Event Calendar" },
            { icon: <AlarmClock className="text-purple-400" />, label: "Emergency Alarm" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-black to-gray-800 text-white border border-gray-700 rounded-md shadow-md hover:shadow-purple-700 transition-all duration-300"
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <section className="flex-1 p-8 text-white">
          {/* Content goes here */}
        </section>
      </main>
    </div>
  );
}
