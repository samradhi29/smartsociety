import { NextRequest, NextResponse } from "next/server";
import Event from "@/model/Event";
import { dbconnect } from "@/app/lib/dbconnect";

export async function POST(req: NextRequest) {
  try {
    await dbconnect();

    const {
      name,
      dateofevent,
      description,
      startTime,
      endTime,
      location,
      societyname,
    } = await req.json();

    // Validate required fields
    if (
      !name ||
      !dateofevent ||
      !description ||
      !startTime ||
      !endTime ||
      !location ||
      !societyname
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert string to Date
    const eventDate = new Date(dateofevent);

    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid event date" },
        { status: 400 }
      );
    }

    const event = await Event.create({
      name,
      dateofevent: eventDate,
      description,
      startTime,
      endTime,
      location,
      societyname,
      images: [],
      attendees: [],
    });

    return NextResponse.json(
      {
        message: "Event added successfully",
        event,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Event creation error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}