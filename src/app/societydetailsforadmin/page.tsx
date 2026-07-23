"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Page() {
  const [flatsData, setFlatsData] = useState<any[]>([]);
  const { data: session, status } = useSession();

  const society = session?.user?.society;

  useEffect(() => {
    if (!society) return;

    const fetchFlats = async () => {
      try {
        const res = await fetch(`/api/flats/${society}`);
        const data = await res.json();
        setFlatsData(data.flats || []);
      } catch (error) {
        console.error("Error fetching flats:", error);
      }
    };

    fetchFlats();
  }, [society]);

  if (status === "loading")
    return <p className="text-gray-300 p-6">Loading...</p>;

  if (!session)
    return <p className="text-gray-300 p-6">Please log in</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      
      {/* ⭐ Gradient Heading ⭐ */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide text-white">
          
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-green-300 bg-clip-text text-transparent">
            {" "}
           Flats in {society} Society
          </span>
        </h1>
        <p className="mt-2 text-gray-400 text-sm">Residents living in your society</p>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700/40 backdrop-blur-sm bg-gray-800/30">
        <table className="min-w-full text-white">
          <thead>
            <tr className="bg-gray-900/80">
              {["Flat Number", "Block", "Floor", "Type", "Size", "Members"].map((title) => (
                <th
                  key={title}
                  className="py-4 px-5 text-left text-sm text-cyan-300 uppercase font-semibold border-b border-gray-700 tracking-wide"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {flatsData.map((flat, i) => (
              <tr
                key={flat._id}
                className={`transition-all ${
                  i % 2 === 0 ? "bg-gray-900/40" : "bg-gray-800/40"
                } hover:bg-gray-700/40 hover:scale-[1.01]`}
              >
                <td className="py-4 px-5 border-b border-gray-700">{flat.flatnumber}</td>
                <td className="py-4 px-5 border-b border-gray-700">{flat.block}</td>
                <td className="py-4 px-5 border-b border-gray-700">{flat.floor}</td>
                <td className="py-4 px-5 border-b border-gray-700 capitalize">
                  {flat.type}
                </td>
                <td className="py-4 px-5 border-b border-gray-700">
                  {flat.size} sqft
                </td>
                <td className="py-4 px-5 border-b border-gray-700">
                  {flat.members?.length ? (
                    flat.members.join(", ")
                  ) : (
                    <span className="text-gray-400 italic">No Members</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
