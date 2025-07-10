import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import Event from "@/model/Event";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbconnect();

  const { id } = await context.params;

  try {
    const body = await req.json();
    const { user } = body;

    if (!user) {
      return NextResponse.json({ error: "User info is required" }, { status: 400 });
    }

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // ✅ Ensure attendees is always an array
    if (!Array.isArray(event.attendees)) {
      event.attendees = [];
    }
event.Rsvp = true;
    if (!event.attendees.includes(user)) {
      event.attendees.push(user);
      await event.save();
    }

    return NextResponse.json({ message: "RSVP successful", attendees: event.attendees });
  } catch (err: any) {
    console.error("RSVP error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

