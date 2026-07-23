import { dbconnect } from "@/app/lib/dbconnect";
import { LostAndFoundModel } from "@/model/lostandfoundfrom";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions  from "../auth/[...nextauth]/options";
import message from "@/model/message";
import { unauthorized } from "next/navigation";
export async function GET() {
  const session = await getServerSession(authOptions);
  if(!session){
    return NextResponse.json({message :unauthorized} , {status : 401});
  }
  try {
    await dbconnect();
    const {society} = session.user;
   const items = await LostAndFoundModel.find({ societyname: society })

  .sort({ createdAt: -1 });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
