import { dbconnect } from "@/app/lib/dbconnect";
import { LostAndFoundModel } from "@/model/lostandfoundfrom";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
export async function POST(req: NextRequest) {
  try {
    await dbconnect();

    const body = await req.json();

    const {
      title,
      description,
      typeofobject,
      location,
      date,
      category,
      urgent,
      imageurls,
      societyname, 
      creater, // <--- added here
    } = body;

if (!societyname) {
  return NextResponse.json({ error: "Society name is required" }, { status: 400 });
}

const session = await getServerSession(authOptions);
if (!session || !session.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
// const creater = session.user.id;
    const newEntry = new LostAndFoundModel({
     creater,
      title,
      description,
      typeofobject,
      location,
      date: new Date(date),
      category,
      urgent: urgent === "true" || urgent === true,
      imageurls,
      status: "open",
      comments: [],
      societyname,  // <--- set here
    });

    await newEntry.save();

    return NextResponse.json({ message: "Item saved", data: newEntry }, { status: 200 });
  } catch (error) {
    console.error("Error saving lost/found:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

