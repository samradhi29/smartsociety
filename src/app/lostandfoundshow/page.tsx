"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeAlert, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Item {
  _id: string;
  title: string;
  description: string;
  typeofobject: string;
  date: string;
  location: string;
  category: string;
  urgent: boolean;
  imageurls: string[];
  status: string;
}

export default function LostAndFoundList() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch("/api/lostandfoundall");
      const data = await res.json();
      setItems(data.items || []);
    }
    fetchItems();
  }, []);

  const openModal = (images: string[]) => {
    setModalImages(images);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImages([]);
  };

  const handleClaim = (id: string) => router.push(`/givetest/${id}`);
  const handleSeeAnswers = (id: string) => router.push(`/seetestresponse/${id}`);

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.typeofobject === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900  text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
      <h1 className="text-2xl sm:text-4xl font-stretch-ultra-expanded text-center mb-10 bg-gradient-to-tr  from-emerald-300  to-cyan-500 bg-clip-text text-transparent animate-fade-in drop-shadow-md tracking-wide">
  Lost & Found Board
</h1>


        {/* Filters */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {["all", "lost", "found"].map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "default"}
              onClick={() => setFilter(type as "all" | "lost" | "found")}
              className={`capitalize h-8 px-4 text-sm ${
                filter === type
                  ? "bg-gradient-to-bl from-cyan-600 text-shadow-teal-500"
                  : "border-gray-600 text-white"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <p className="text-center col-span-full text-gray-400 italic">
              No items found for this filter.
            </p>
          ) : (
            filteredItems.map((item) => (
       <Card
  key={item._id}
  className="bg-gradient-to-bl from-black to-zinc-900 border border-zinc-800 rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 transition-all duration-300"
>
  <CardHeader className="pb-2">
    <div className="flex justify-between items-start text-gray-300">
      <CardTitle className="text-lg font-bold text-green-300 tracking-wide">
        {item.title}
      </CardTitle>
 <p>
        <span className="text-white font-medium"></span>{" "}
        {new Date(item.date).toLocaleDateString()}
      </p>

      {item.urgent && (
        <div className="text-red-500 text-xs flex items-center gap-1 font-semibold animate-pulse">
          <BadgeAlert className="w-4 h-4" />
          Urgent
        </div>
      )}
    </div>
  </CardHeader>

  <CardContent className="space-y-2 text-sm text-gray-300 pb-4">
   <div className="flex justify-between">
    <p>
      <span className="font-medium text-white"></span>{" "}
      {item.typeofobject}
    </p>
      <p>
        <span className="text-gray-200 font-stretch-125% font-medium"></span>{" "}
        {item.category}
      </p>
      </div>
    <Separator className="bg-white/10 my-1" />

    {/* <div className="grid grid-cols-2 gap-2 text-sm"> */}
    
      <p>
        <span className="text-gray-300 font-medium">Location:</span>{" "}
        {item.location}
      </p>
     
      <p>
        <span className="text-gray-300 font-medium">Status:</span>{" "}
        {item.status}
      </p>
    {/* </div> */}

    {/* Images */}
    <div className="flex gap-2 mt-3">
      {item.imageurls.slice(0, 2).map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`img-${i}`}
          className="w-16 h-16 object-cover rounded-lg border border-white/10 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => openModal(item.imageurls)}
        />
      ))}
      {item.imageurls.length > 2 && (
        <div
          className="w-16 h-16 bg-zinc-700 text-white rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer"
          onClick={() => openModal(item.imageurls)}
        >
          +{item.imageurls.length - 2}
        </div>
      )}
    </div>

    {/* Buttons */}
    <div className="flex gap-3 mt-4">
      <Button
        onClick={() => handleClaim(item._id)}
        className="h-8 px-4 text-xs font-semibold border border-emerald-300 text-gray-300 bg-black hover:bg-yellow-600 hover:text-black transition"
      >
        Claim
      </Button>
      <Button
        onClick={() => handleSeeAnswers(item._id)}
        className="h-8 px-4 text-xs font-semibold border border-emerald-300 text-gray-300 bg-black hover:bg-blue-700 transition"
      >
        <Eye className="w-4 h-4 mr-1" />
        See Answers
      </Button>
    </div>
  </CardContent>
</Card>

            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
            onClick={closeModal}
          >
            <div
              className="bg-white p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-black">Image Gallery</h3>
                <button
                  onClick={closeModal}
                  className="text-red-600 text-2xl font-bold hover:scale-110 transition"
                >
                  &times;
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {modalImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`modal-${i}`}
                    className="w-full h-40 object-cover rounded shadow"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
