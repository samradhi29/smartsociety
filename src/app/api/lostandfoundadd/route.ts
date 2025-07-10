import { dbconnect } from "@/app/lib/dbconnect";
import { LostAndFoundModel } from "@/model/lostandfoundfrom";
import { NextRequest, NextResponse } from "next/server";

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
      societyname,  // <--- added here
    } = body;

    if (!societyname) {
      return NextResponse.json({ error: "Society name is required" }, { status: 400 });
    }

    const newEntry = new LostAndFoundModel({
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

