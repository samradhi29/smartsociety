'use client';

import React, { useEffect, useState } from "react";
import {
  Home,
  Building2,
  AlertCircle,
  Users,
  Search,
  LogIn,
  Dumbbell,
  Calendar,
  AlarmClock,
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function SocietyDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const societyName = session?.user?.society;
    if (!societyName) {
      setError("No society assigned to this user.");
      return;
    }

    fetch(`/societydashboard/${encodeURIComponent(societyName)}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch dashboard data");
        }
        return res.json();
      })
      .then(setDashboardData)
      .catch((err) => setError(err.message));
  }, [session, status]);

  const sidebarItems = [
    { icon: <Home />, label: "Society Dashboard", route: "/admin/dashboard" },
    // { icon: <Building2 />, label: "Flats View", route: "/flatsview" },
    { icon: <AlertCircle />, label: "Complaint Box", route: "/complaintform" },
    { icon: <AlertCircle />, label: "Show Complaints", route: "/showcomplaints" },
    { icon: <Users />, label: "Chat Room", route: "/chatarea" },
    { icon: <Users />, label: "Meeting Records", route: "/Showallmeetings" },
    { icon: <Search />, label: "Lost & Found", route: "/lostandfound" },
    { icon: <LogIn />, label: "Visitor Login", route: "/Visitorlogin" },
    { icon: <AlertCircle />, label: "Visitor History", route: "/visitorhistory" },
    { icon: <Dumbbell />, label: "Maintenance Bills", route: "/showmonthlybill" },
    { icon: <AlertCircle />, label: "Set Charges", route: "/adminchargesset" },
    { icon: <AlertCircle />, label: "Lost Items Log", route: "/lostandfoundshow" },
    { icon: <Calendar />, label: "Event Calendar", route: "/FetchEvents" },
    { icon: <AlarmClock />, label: "Emergency Alarm" },
  ];

  if (status === "loading") {
    return <p className="p-8 text-white">Loading session...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-500 font-semibold">{error}</p>;
  }

  return (
    <div className="w-screen h-screen bg-black to-zinc-800 text-white overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-700 backdrop-blur bg-gradient-to-br from-black to-zinc-950">
        <img src="/logo.png" alt="Sociopia logo" className="h-10 w-auto" />
        <h1 className="text-4xl font-stretch-extra-expanded text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-cyan-500">
          Sociopia
        </h1>
      </header>

      <main className="flex flex-1">
        {/* Sidebar */}
      <aside className="w-64 h-screen p-4 bg-black border-r border-zinc-800 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900">

          <nav className="space-y-2">
            {sidebarItems.map(({ icon, label, route }) => (
              <button
                key={label}
                onClick={() => route && router.push(route)}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-bl from-black to-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500 transition duration-200"
              >
                <span className="text-gray-300">{icon}</span>
                <span className="text-sm font-medium truncate text-blue-200">{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <section className="flex-1 p-8 space-y-6 overflow-y-auto no-scrollbar">
          {!dashboardData ? (
            <p className="text-gray-300">Loading dashboard...</p>
          ) : (
            <>
              {/* Society Info */}
              <Card className="bg-gradient-to-br from-black to-zinc-900 border border-zinc-700 shadow-md backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-100 font-stretch-semi-expanded"> Society Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-300 space-y-1">
                  <p><strong>Name:</strong> {dashboardData.society.name}</p>
                  <p><strong>Address:</strong> {dashboardData.society.address}</p>
                  {/* <p><strong>Email:</strong> {dashboardData.society.email}</p> */}
                </CardContent>
              </Card>

              {/* Complaints and Visitors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-black to-zinc-950 border border-zinc-700 shadow-md backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-100 font-stretch-semi-expanded"> Recent Complaints</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-300 space-y-1">
                    {dashboardData.recentComplaints.length === 0 ? (
                      <p>No complaints yet.</p>
                    ) : (
                      dashboardData.recentComplaints.map((c: any) => (
                        <p key={c._id}>{c. complaintext} - {new Date(c.createdAt).toLocaleDateString()}</p>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-black to-zinc-900 border border-zinc-700 shadow-md backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-100 font-stretch-semi-expanded">Recent Visitors</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-300 space-y-1">
                    {dashboardData.recentVisitors.length === 0 ? (
                      <p>No visitors recorded yet.</p>
                    ) : (
                      dashboardData.recentVisitors.map((v: any) => (
                        <p key={v._id}>{v.name}</p>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Custom scrollbar hide */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
