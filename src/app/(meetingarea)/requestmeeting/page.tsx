"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CreateMeeting() {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    purpose: "",
    datetime: "",
    endtime: "",
    type: "online",
    location: "",
    minperson: "",
      createdBy : ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const meetingData = {
      purpose: form.purpose,
      datetime: new Date(form.datetime),
      Endtime: new Date(form.endtime),
      type: form.type,
      location: form.type === "offline" ? form.location : undefined,
      minperson: form.minperson,
      // createdBy: session?.user.id,
      societyname: session?.user.society, // Make sure this exists in the session
    };

    try {
      const res = await fetch("/api/requestmeeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    
        body: JSON.stringify(meetingData),
      });
console.log( session?.user.id)
      if (!res.ok) throw new Error("Failed to submit request");
      alert("Meeting request submitted");
    } catch (error) {
      console.error(error);
      alert("Error submitting meeting request");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-slate-900 px-4 py-10 shadow-2xl shadow-cyan-600">
      <Card className="w-full max-w-xl backdrop-blur-md border border-slate-800 bg-black/50 rounded-4xl transition-all duration-300 hover:scale-[1.01] shadow-2xl shadow-cyan-500">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-stretch-ultra-condensed bg-gradient-to-r from-green-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            Create Meeting Request
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-400">Purpose</Label>
              <Input
                className="bg-black border-slate-500 text-white"
                value={form.purpose}
                onChange={(e) =>
                  setForm({ ...form, purpose: e.target.value })
                }
                placeholder="Enter purpose of meeting"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Start Date & Time</Label>
              <Input
                className="bg-black border-slate-700 text-white"
                type="datetime-local"
                value={form.datetime}
                onChange={(e) =>
                  setForm({ ...form, datetime: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">End Date & Time</Label>
              <Input
                className="bg-black border-slate-700 text-white"
                type="datetime-local"
                value={form.endtime}
                onChange={(e) =>
                  setForm({ ...form, endtime: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Meeting Type</Label>
              <Select
                value={form.type}
                onValueChange={(val) =>
                  setForm({ ...form, type: val })
                }
              >
                <SelectTrigger className="bg-black border-slate-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-black border-slate-600 text-white">
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.type === "offline" && (
              <div className="space-y-2">
                <Label className="text-slate-300">Location</Label>
                <Input
                  className="bg-black border-slate-700 text-white"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Enter meeting location"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-slate-400">Minimum Persons Required</Label>
              <Input
                className="bg-black border-slate-700 text-white"
                type="number"
                value={form.minperson}
                onChange={(e) =>
                  setForm({ ...form, minperson: e.target.value })
                }
                placeholder="e.g., 5"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 text-white bg-gradient-to-r from-green-400 via-blue-500 to-cyan-400 hover:brightness-110 transition-all duration-200"
            >
              Request Meeting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
