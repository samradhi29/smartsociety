"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ThumbsUp, CheckCircle, PlusCircle, DoorOpen } from "lucide-react";

export default function ShowRequestedMeeting() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [request, setRequest] = useState<any[]>([]);

  const userId = session?.user?.id;
  const roleOfUser = session?.user?.role;
  const societyname = session?.user?.society;

  const fetchRequest = async () => {
    if (!societyname) return;
    const res = await fetch(`/api/getmeetingsbysociety/${societyname}`);
    const data = await res.json();
    setRequest(data);
  };

  const voteRequest = async (meetingId: string) => {
    await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingId, userId }),
    });
    fetchRequest();
  };

  const approveRequest = async (meetingId: string) => {
    await fetch("/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingId }),
    });
    fetchRequest();
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchRequest();
    }
  }, [status]);

  const now = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto mb-6">
        <motion.h1
          className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-400 to-emerald-400 text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Society Meeting Dashboard
        </motion.h1>

        <Button
          className="mt-4 bg-black text-white font-medium shadow-md border-2 border-gray-500 shadow-gray-700"
          onClick={() => router.push("/requestmeeting")}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Request New Meeting
        </Button>
      </div>

      {/* Info */}
      <div className="text-center mt-10 mb-10 mx-auto text-sm text-black w-2xl rounded-4xl">
        <span className="font-semibold text-white">Voting & Approval Info:</span>{" "}
        <span className="text-gray-300">
          A minimum number of votes is required to approve a meeting. Admins can approve once eligible.
        </span>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto max-w-6xl mx-auto"
      >
        <table className="w-full table-auto shadow-xl rounded-xl overflow-hidden border border-white/20">
          <thead className="bg-gradient-to-tl from-black to-cyan-900 border-b border-white/30">
            <tr>
              <th className="px-6 py-4 border-r border-white/20 text-gradient">Purpose</th>
              <th className="px-6 py-4 border-r border-white/20 text-gradient">Date & Time</th>
              <th className="px-6 py-4 border-r border-white/20 text-gradient">Votes</th>
              <th className="px-6 py-4 text-center text-gradient">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-gradient-to-br from-black to-zinc-900 divide-y divide-white/15 text-sm sm:text-base">
            {request.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No meetings yet.
                </td>
              </tr>
            ) : (
              request.map((req) => {
                const startTime = new Date(req.datetime);
                const endTime = new Date(req.Endtime);
                const isMeetingTime = startTime <= now && now <= endTime;
                const isCompleted = now > endTime;

                return (
                  <tr
                    key={req._id}
                    className="hover:bg-white/5 transition duration-200 border-b border-white/15"
                  >
                    <td className="px-6 py-4 border-r border-white/10 text-white font-medium">
                      {req.purpose}
                    </td>
                    <td className="px-6 py-4 border-r border-white/10 text-white">
                      {startTime.toLocaleString()} → {endTime.toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-center border-r border-white/10 text-white">
                      {req.votes?.length || 0}
                    </td>
                    <td className="px-6 py-4 flex flex-col sm:flex-row justify-center gap-3 text-center">
                      {/* Vote button */}
                      <Button
                        onClick={() => voteRequest(req._id)}
                        className="bg-black hover:bg-blue-700 text-white flex items-center gap-2 border-2 border-cyan-200"
                      >
                        <ThumbsUp size={12} />
                        Vote
                      </Button>

                      {/* Admin Approval */}
                      {roleOfUser === "admin" &&
                        req.status === "pending" &&
                        req.votes?.length >= parseInt(req.minperson) && (
                          <Button
                            onClick={() => approveRequest(req._id)}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                          >
                            <CheckCircle size={18} />
                            Approve
                          </Button>
                        )}

                      {/* Join Button */}
                      {req.status === "approved" && isMeetingTime && (
                        <Button
                          onClick={() => router.push(`/joinmeeting/${req._id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                        >
                          <DoorOpen size={18} />
                          Join Meeting
                        </Button>
                      )}

                      {/* Status Text */}
                      {req.status === "approved" && !isMeetingTime && !isCompleted && (
                        <span className="text-yellow-300">Upcoming</span>
                      )}

                      {req.status === "approved" && isCompleted && (
                        <span className="text-gray-400">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
