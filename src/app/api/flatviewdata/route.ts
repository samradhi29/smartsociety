import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { flatsModel } from "@/model/flats";
import authOptions from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!session.user?.society) {
    return new Response(JSON.stringify({ message: "Society not found in session" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await dbconnect();
    const usersociety = session.user.society;

    const flats = await flatsModel.find({ society: usersociety }); // ⬅ FIXED: plural find

    if (!flats || flats.length === 0) {
      return new Response(JSON.stringify({ message: "No flats found for this society" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(flats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching flats:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
