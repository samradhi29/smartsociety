import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import meeting from "@/model/meeting";

export async function POST(req: NextRequest) {
  await dbconnect();

  const { meetingId, userId } = await req.json(); 

  try {
    const m = await meeting.findById(meetingId);
    if (!m) {
      return NextResponse.json({ message: "Meeting not found" }, { status: 404 });
    }

    if (m.votes?.includes(userId)) { 
      return NextResponse.json({ message: "Already voted" }, { status: 400 });
    }

    m.votes = [...(m.votes || []), userId];
    await m.save();

    return NextResponse.json({ message: "Voted SUCCESSFULLY" });
  } catch (error) {
    return NextResponse.json({ message: "Error voting", error }, { status: 500 });
  }
}
