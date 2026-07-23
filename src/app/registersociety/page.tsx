"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterSocietyPage() {
  const router = useRouter();

  const [societyName, setSocietyName] = useState("");
  const [societyAddress, setSocietyAddress] = useState("");

  if (typeof window !== "undefined") {
    localStorage.setItem("societyid", societyName);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/society", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ societyName, societyAddress }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Society registered successfully!");
      router.push("/flats");
    } else {
      alert(data.error || "Failed to register society.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-slate-900 px-4 py-10 gap-30">
   <h1 className="text-2xl bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-500 bg-clip-text text-transparent">
 welcome to socitopia!
<p className="text-sm text-slate-300 mt-2 text-center">
  Manage your society with ease, transparency, and connection.
</p>

 
</h1>

      <Card className="w-115  max-w-3xl bg-black border border-yellow-100   text-white rounded-4xl ">
        <CardHeader>
          <CardTitle className="text-center text-2xl  text-amber-300 font-stretch-ultra-expanded ml-20">
           <p className="shadow-2xl  w-50 rounde">Register Society</p> 
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              {/* <h2 className="text-xl font-semibold text-slate-200 mb-3">
                Society Details
              </h2> */}

              <div className="space-y-4">
                <div>
                  {/* <Label className="text-white">Society Name</Label> */}
                  <Input
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    placeholder="Enter society name"
                    className="bg-black text-white  shadow-2xl  border border-yellow-1000 placeholder-gray-400 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  {/* <Label className="text-white">Society Address</Label> */}
                  <Input
                    value={societyAddress}
                    onChange={(e) => setSocietyAddress(e.target.value)}
                    placeholder="Enter society address"
                    className="bg-black text-white border border-yellow-100 rounded-b-lg shadow-2xl placeholder-gray-400 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

           <div className="flex justify-center">
  <Button
    type="submit"
    className="w-40 text-end  bg-blue-200 text-black font-semibold rounded-xl py-2 transition duration-300 shadow-lg hover:brightness-110"
  >
    Register
  </Button>
</div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
