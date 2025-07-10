import { NextResponse, NextRequest } from "next/server";
import Event from "@/model/Event";
import { dbconnect } from "@/app/lib/dbconnect";

export async function POST(req: NextRequest) {
  try {
    await dbconnect();

    const data = await req.json();
    const { name, dateofevent, description, startTime, endTime, location, societyname } = data;

    if (!name || !dateofevent || !description || !startTime || !endTime || !location || !societyname) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = new Event({
      name,
      dateofevent,
      description,
      startTime,
      endTime,
      location,
      societyname,   // <-- Added societyname here
      images: [],
      attendees: []
      
    });

    await event.save();

    return NextResponse.json({ message: "Event added successfully" }, { status: 201 });
  } catch (err: any) {
    console.error("Event creation error:", err.message);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
