"use client";
import React, { useState, useRef , useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function Page() {
  const [flatnumber, setFlatnumber] = useState("");
  const [text, setText] = useState("");
  const [catagory, setcatagory] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [listening, setListening] = useState(false);
  const [societyname , setsocietyname] = useState("");
  const recognitionRef = useRef<any>(null);
const {data : session , status} = useSession();
useEffect(() => {
    if (session?.user?.society) {
      setsocietyname(session.user.society);
    }
  }, [session]);
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
    recognition.start();

    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleListening = () => {
    listening ? stopListening() : startListening();
  };

  const submitComplaint = async () => {
    if (!flatnumber.trim() || !text.trim()) {
      console.log("Please fill in all the details");
      return;
    }

    try {
      const res = await fetch("/api/addcomplaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flatnumber: flatnumber.trim(),
          text: text.trim(),
          catagory,
          anonymous,
         societyname
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error submitting complaint:", data.message || data);
      } else {
        console.log("Complaint submitted successfully");
        setFlatnumber("");
        setText("");
        setcatagory("");
        setAnonymous(false);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  return (
<div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-10">
  <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
    {/* Left Info Section */}
    <div className="flex-1 px-4 py-6">
     <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text mb-4 "
>
  <p>Got Issues?</p>
  <p>Let’s Fix Them!</p>
</motion.div>
     <p className="text-gray-300 mb-2 font-semibold mt-30 text-2xl">
  Trouble at home or with neighbors? Let us know!
</p>
<p className="text-blue-300 italic font-bold bg-clip-text shadow-2xl animate-pulse">
  Too tired to type? Use voice input.
</p>

<p className="text-green-300 italic font-bold bg-clip-text animate-pulse">
  Stay anonymous if you want!
</p>



      {/* <p className="text-gray-400 mb-2">
        No need to stress over typing — use voice input and speak freely.
      </p>
      <p className="text-gray-400">
        Not comfortable revealing your identity? Send your complaint anonymously and rest easy.
      </p> */}
    </div>

    {/* Right Complaint Form */}
    <Card className="flex-1 bg-black border border-slate-700 text-white shadow-2xl shadow-cyan-950">
      <CardHeader>
        <CardTitle className="text-2xl text-center  font-stretch-50% font-bold text-slate-300">
          Submit a Complaint
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-6">
        <div>
          {/* <Label className="text-gray-400" htmlFor="flatnumber">Flat Number</Label> */}
          <Input
            id="flatnumber"
            value={flatnumber}
            onChange={(e) => setFlatnumber(e.target.value)}
            placeholder="Enter flat number"
            className="mt-1"
          />
        </div>

        <div>
          {/* <Label className="text-gray-400" htmlFor="text">Complaint</Label> */}
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your complaint"
            className="mt-1"
          />
          <Button
          
            variant="ghost"
            type="button"
            onClick={toggleListening}
            className={`mt-2 ${listening ? "text-blue-50" : "text-gray-400"}`}
          >
            🎤 {listening ? "Stop Voice Input" : "Use Voice Input"}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label className="text-gray-400" htmlFor="catagory">Category</Label>
            <Input
              id="catagory"
              value={catagory}
              onChange={(e) => setcatagory(e.target.value)}
              placeholder="e.g. Water, Security"
              className="mt-1"
            />
          </div>

          <div className="flex-1">
            <Label className="text-gray-400" htmlFor="anonymous">Anonymously?</Label>
            <Select
              value={anonymous ? "true" : "false"}
              onValueChange={(val) => setAnonymous(val === "true")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

  <Button
  variant="secondary"
  onClick={submitComplaint}
  className="w-full mt-4 bg-gradient-to-r from-green-400 via-blue-500 to-cyan-400 text-white font-semibold shadow-md"
>
  Submit Complaint
</Button>

      </CardContent>
    </Card>
  </div>
</div>

  );
}
